import { generateFileName, getMimeType } from '@/src/shared/utils/mediaUtils';
import { useStompStore } from '@/src/store/useStompStore';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { useCallback } from 'react';
import { generateVideoThumbnailAPI, getPresignedUrlAPI, uploadToS3API } from '../api/upload';
import { useChatStore } from '../stores/useChatStore';
import { ChatMessage } from '../types';

interface MediaUploadHook {
  uploadMedia: (roomId: string, mediaType: 'IMAGE' | 'VIDEO', localUri: string) => Promise<void>;
  retryUpload: (tempId: string) => Promise<void>;
}

export const useMediaUpload = (): MediaUploadHook => {
  const stompConnection = useStompStore((state) => state);

  // Store 액션
  const addOptimisticMessage = useChatStore((state) => state.addOptimisticMessage);
  const updateMessageStatus = useChatStore((state) => state.updateMessageStatus);
  const updateMessageError = useChatStore((state) => state.updateMessageError);

  /**
   * 미디어 업로드 메인 로직
   */
  const uploadMedia = useCallback(
    async (roomId: string, mediaType: 'IMAGE' | 'VIDEO', localUri: string) => {
      const myUserId = await SecureStore.getItemAsync('MyuserId');
      if (!myUserId) {
        throw new Error('사용자 ID를 찾을 수 없습니다');
      }

      if (!stompConnection.connected) {
        throw new Error('STOMP 연결이 되어있지 않습니다');
      }

      // 임시 ID 생성 (음수 사용)
      const tempId = Crypto.randomUUID();
      const tempMessageId = -Date.now(); // 음수 ID

      try {
        // 1️⃣ 썸네일 생성 (VIDEO만)
        let thumbnailUri: string | null = null;
        if (mediaType === 'VIDEO') {
          thumbnailUri = await generateVideoThumbnailAPI(localUri);
        }

        // 2️⃣ 임시 메시지 추가 (낙관적 업데이트)
        const optimisticMessage: ChatMessage = {
          id: tempMessageId,
          roomId: Number(roomId),
          senderId: Number(myUserId),
          senderFirstName: '',
          senderLastName: '',
          senderImageUrl: '',
          originContent: mediaType === 'IMAGE' ? 'picture' : 'video',
          targetContent: '',
          sentAt: `${Date.now() / 1000}`,
          messageType: mediaType,
          mediaUrl: null,
          thumbnailUrl: null,
          localUrl: localUri,
          uploadStatus: 'pending',
          tempId,
        };

        addOptimisticMessage(optimisticMessage);

        // 3️⃣ 파일명 생성
        const mediaFileName = generateFileName(localUri);

        // 4️⃣ 상태 업데이트 (uploading)
        updateMessageStatus(tempId, 'uploading');

        // 5️⃣ Presigned URL 요청 (미디어)
        const mimeType = getMimeType(localUri, mediaType);
        const mediaPresigned = await getPresignedUrlAPI(roomId, mediaFileName, mediaType);

        // 6️⃣ S3 업로드 (미디어)
        await uploadToS3API(mediaPresigned.presignedUrl, localUri, mimeType);

        // 7️⃣ S3 업로드 (썸네일)
        if (mediaPresigned.thumbnailKey && mediaPresigned.thumbnailUrl && thumbnailUri) {
          try {
            await uploadToS3API(mediaPresigned.thumbnailUrl, thumbnailUri, 'image/jpeg');
          } catch (error) {
            console.error('썸네일 업로드 실패:', error);
            // 썸네일 실패 시 전체 실패
            throw new Error('썸네일 업로드에 실패했습니다');
          }
        }

        // 8️⃣ 웹소켓 메시지 전송
        const messageBody = {
          roomId,
          senderId: myUserId,
          messageType: mediaType,
          mediaKey: mediaPresigned.fileKey,
          thumbnailKey: mediaPresigned.thumbnailKey,
        };

        await stompConnection.publish('/app/chat.sendMedia', messageBody);

        // 9️⃣ 상태 업데이트 (success) - 소켓 응답에서 실제 교체됨
        updateMessageStatus(tempId, 'success');
      } catch (error) {
        console.error('미디어 업로드 실패:', error);

        // 에러 처리
        const errorMessage = error instanceof Error ? error.message : '업로드에 실패했습니다';
        updateMessageError(tempId, errorMessage);
      }
    },
    [stompConnection, addOptimisticMessage, updateMessageStatus, updateMessageError],
  );

  /**
   * 재시도
   */
  const retryUpload = useCallback(
    async (tempId: string) => {
      // 실패한 메시지 찾기
      const messages = useChatStore.getState().messages;
      const failedMessage = messages.find((m) => m.tempId === tempId && m.uploadStatus === 'failed');

      if (!failedMessage || !failedMessage.localUrl) {
        console.error('재시도할 메시지를 찾을 수 없습니다');
        return;
      }

      // 기존 실패 메시지 제거
      useChatStore.getState().removeOptimisticMessage(tempId);

      // 재업로드
      await uploadMedia(
        String(failedMessage.roomId),
        failedMessage.messageType as 'IMAGE' | 'VIDEO',
        failedMessage.localUrl,
      );
    },
    [uploadMedia],
  );

  return {
    uploadMedia,
    retryUpload,
  };
};
