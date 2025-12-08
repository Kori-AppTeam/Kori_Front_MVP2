import api from '@/api/axiosInstance';
import axios from 'axios';
import { Buffer } from 'buffer';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import { PresignedUrlInfo } from '../types';

/**
 * Presigned URL 발급 API
 */
export const requestPresignedUrl = async (filename: string): Promise<PresignedUrlInfo> => {
  const uploadSessionId = Crypto.randomUUID();
  const requestBody = {
    imageType: 'POST',
    uploadSessionId: uploadSessionId,
    files: [
      {
        filename,
        contentType: 'image/jpeg',
      },
    ],
  };

  const res = await api.post('/api/v1/images/presign', requestBody);
  return res.data.data[0];
};

/**
 * NCP Storage에 이미지 업로드 API
 */
export const uploadToNCPStorage = async (presignedInfo: PresignedUrlInfo, imageUri: string): Promise<void> => {
  // Base64 인코딩된 파일 읽기
  const fileData = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Base64 → Buffer 변환
  const buffer = Buffer.from(fileData, 'base64');

  // PUT 요청
  await axios.put(presignedInfo.putUrl, buffer, {
    headers: {
      ...presignedInfo.headers,
      'Content-Type': 'image/jpeg',
    },
  });
};
