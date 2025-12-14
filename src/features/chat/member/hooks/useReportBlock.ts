import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { blockUser, checkIsGroupChat } from '../api';
import type { LeaveChatCallback } from '../types';

interface UseReportBlockParams {
  roomId: string | number;
  onLeaveChat: LeaveChatCallback;
}

interface UseReportBlockReturn {
  // BottomSheet Refs
  reportBlockSheetRef: React.RefObject<BottomSheetModal | null>;
  reportReasonSheetRef: React.RefObject<BottomSheetModal | null>;
  reportDetailSheetRef: React.RefObject<BottomSheetModal | null>;

  // 선택된 사용자 정보
  selectedMemberName: string | null;
  targetUserId: number | null;

  // 모달 제어
  openReportBlockMenu: (userId: number, memberName: string) => void;
  closeReportBlockSheet: () => void;
  openReportReasonSheet: () => void;
  closeReportReasonSheet: () => void;
  openReportDetailSheet: () => void;
  closeReportDetailSheet: () => void;

  // 액션
  handleBlockUser: () => void;
  handleSubmitReport: (details: string) => Promise<void>;
}

/**
 * 신고/차단 및 관련 모달 관리 Hook
 */
export const useReportBlock = ({ roomId, onLeaveChat }: UseReportBlockParams): UseReportBlockReturn => {
  // BottomSheet Refs
  const reportBlockSheetRef = useRef<BottomSheetModal | null>(null);
  const reportReasonSheetRef = useRef<BottomSheetModal | null>(null);
  const reportDetailSheetRef = useRef<BottomSheetModal | null>(null);

  // 선택된 사용자 정보
  const [selectedMemberName, setSelectedMemberName] = useState<string | null>(null);
  const [targetUserId, setTargetUserId] = useState<number | null>(null);

  // 신고/차단 메뉴 열기
  const openReportBlockMenu = (userId: number, memberName: string) => {
    setSelectedMemberName(memberName);
    setTargetUserId(userId);
    reportBlockSheetRef.current?.present();
  };

  // 신고/차단 메뉴 닫기
  const closeReportBlockSheet = () => {
    reportBlockSheetRef.current?.dismiss();
  };

  // 신고 사유 선택 메뉴 열기
  const openReportReasonSheet = () => {
    closeReportBlockSheet();
    setTimeout(() => {
      reportReasonSheetRef.current?.present();
    }, 300);
  };

  // 신고 사유 선택 메뉴 닫기
  const closeReportReasonSheet = () => {
    reportReasonSheetRef.current?.dismiss();
  };

  // 신고 상세 입력 모달 열기
  const openReportDetailSheet = () => {
    closeReportReasonSheet();
    setTimeout(() => {
      reportDetailSheetRef.current?.present();
    }, 300);
  };

  // 신고 상세 입력 모달 닫기
  const closeReportDetailSheet = () => {
    reportDetailSheetRef.current?.dismiss();
  };

  // 차단하기
  const handleBlockUser = () => {
    closeReportBlockSheet();

    Alert.alert(
      'Block User',
      'If you block this user in a 1-on-1 chat, you will leave the chat room.\n\nIn a group chat, you will no longer see messages from the blocked user.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Block User',
          onPress: async () => {
            if (!targetUserId) return;

            try {
              // 그룹 채팅 여부 확인
              const isGroup = await checkIsGroupChat(roomId);

              // 사용자 차단
              await blockUser(targetUserId);

              // 1:1 채팅이면 채팅방 나가기
              if (!isGroup) {
                await onLeaveChat();
              }

              Toast.show({
                type: 'success',
                text1: 'Blocking this user success',
              });

              // 상태 초기화
              setTargetUserId(null);
              setSelectedMemberName(null);
            } catch (error) {
              console.error('block error', error);
              Toast.show({
                type: 'error',
                text1: 'Blocking this user fail',
              });
            }
          },
        },
      ],
    );
  };

  // 신고 제출
  const handleSubmitReport = async (details: string) => {
    if (!targetUserId) return;

    try {
      // TODO: API 스펙 확인 후 주석 해제
      // await reportUser(targetUserId, details);

      Toast.show({
        type: 'success',
        text1: 'Your report has been received',
        text2: 'It takes up to 24 hours to review',
      });

      closeReportDetailSheet();
      setTargetUserId(null);
      setSelectedMemberName(null);
    } catch (error) {
      console.error('신고 실패', error);
      Toast.show({
        type: 'error',
        text1: 'Report Fail',
      });
      closeReportDetailSheet();
    }
  };

  return {
    // BottomSheet Refs
    reportBlockSheetRef,
    reportReasonSheetRef,
    reportDetailSheetRef,

    // 선택된 사용자 정보
    selectedMemberName,
    targetUserId,

    // 모달 제어
    openReportBlockMenu,
    closeReportBlockSheet,
    openReportReasonSheet,
    closeReportReasonSheet,
    openReportDetailSheet,
    closeReportDetailSheet,

    // 액션
    handleBlockUser,
    handleSubmitReport,
  };
};
