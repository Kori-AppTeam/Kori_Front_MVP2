import api from '@/api/axiosInstance';
import axios from 'axios';
import { Buffer } from 'buffer';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';

// ============= Presigned URL 응답 타입 =============
interface PresignedUrlResponse {
  putUrl: string;
  key: string;
  headers: Record<string, string>;
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
    const uploadSessionId = Crypto.randomUUID();

    const res = await api.post(`/api/v1/images/presign`, {
      imageType: 'POST', // 채팅용
      uploadSessionId,
      files: [
        {
          filename: fileName,
          contentType,
        },
      ],
    });

    return res.data.data[0];
  } catch (error) {
    console.error('Presigned URL 요청 실패:', error);
    throw new Error('업로드 URL을 받아오는데 실패했습니다');
  }
};

// ============= 3️⃣ S3 업로드 =============
export const uploadToS3API = async (
  presignedUrl: string,
  fileUri: string,
  mimeType: string,
  headers?: Record<string, string>,
): Promise<void> => {
  try {
    // 1️⃣ Base64 인코딩된 파일 읽기
    const fileData = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 2️⃣ Base64 → Buffer 변환
    const buffer = Buffer.from(fileData, 'base64');

    // 3️⃣ PUT 요청
    await axios.put(presignedUrl, buffer, {
      headers: {
        ...headers,
        'Content-Type': mimeType,
      },
    });
  } catch (error) {
    console.error('S3 업로드 실패:', error);
    throw new Error('파일 업로드에 실패했습니다');
  }
};
