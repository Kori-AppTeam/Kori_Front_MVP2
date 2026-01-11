import api from '@/api/axiosInstance';
import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';

// ============= Presigned URL 응답 타입 =============
interface PresignedUrlResponse {
  presignedUrl: string;
  fileKey: string;
}

// ============= 1️⃣ 동영상 썸네일 생성 =============
export const generateVideoThumbnailAPI = async (videoUri: string): Promise<string> => {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: 0, // 0초 시점
    });
    return uri;
  } catch (error) {
    console.error('썸네일 생성 실패:', error);
    throw new Error('썸네일 생성에 실패했습니다');
  }
};

// ============= 2️⃣ Presigned URL 요청 (단일 파일) =============
export const getPresignedUrlAPI = async (
  roomId: string,
  fileName: string,
  contentType: string,
): Promise<PresignedUrlResponse> => {
  try {
    const res = await api.post(`/api/v1/chat/presigned-url/chat/${roomId}`, { fileName });

    return res.data.data;
  } catch (error) {
    console.error('Presigned URL 요청 실패:', error);
    throw new Error('업로드 URL을 받아오는데 실패했습니다');
  }
};

// ============= 3️⃣ S3 업로드 =============
export const uploadToS3API = async (presignedUrl: string, fileUri: string, mimeType: string): Promise<void> => {
  try {
    // expo-file-system의 uploadAsync 사용 (바이너리 직접 전송)
    const uploadResult = await FileSystem.uploadAsync(presignedUrl, fileUri, {
      httpMethod: 'PUT',
      headers: {
        'Content-Type': mimeType,
      },
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    });

    if (uploadResult.status !== 200) {
      throw new Error(`업로드 실패: ${uploadResult.status}`);
    }
  } catch (error) {
    console.error('S3 업로드 실패:', error);
    throw new Error('파일 업로드에 실패했습니다');
  }
};
