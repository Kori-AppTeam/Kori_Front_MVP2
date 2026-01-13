import axios from 'axios';
import { Buffer } from 'buffer';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import api from '@/api/axiosInstance';
import { PresignedInfo } from '@/src/features/profile-setup/types';

export async function requestImagePresign(params: {
  fileName: string;
  contentType: string;
  uploadSessionId: string;
}): Promise<PresignedInfo> {
  const requestBody = {
    imageType: 'USER',
    uploadSessionId: params.uploadSessionId,
    files: [
      {
        filename: params.fileName,
        contentType: params.contentType,
      },
    ],
  };

  const res = await api.post('/api/v1/images/presign', requestBody);

  const presignedInfo = res.data?.data?.[0];
  if (!presignedInfo?.putUrl || !presignedInfo?.key) {
    throw new Error('Invalid presign response');
  }

  return {
    key: String(presignedInfo.key),
    putUrl: String(presignedInfo.putUrl),
    headers: (presignedInfo.headers ?? {}) as Record<string, string>,
  };
}

export async function uploadFileToPresignedUrl(params: {
  uri: string;
  putUrl: string;
  headers: Record<string, string>;
  contentType: string;
}): Promise<void> {
  const fileData = await FileSystem.readAsStringAsync(params.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const buffer = Buffer.from(fileData, 'base64');

  await axios.put(params.putUrl, buffer, {
    headers: {
      ...params.headers,
      'Content-Type': params.contentType,
    },
  });
}

export async function uploadUserImage(params: { uri: string; fileName: string; contentType: string }): Promise<string> {
  const uploadSessionId = Crypto.randomUUID();
  const presignedInfo = await requestImagePresign({
    fileName: params.fileName,
    contentType: params.contentType,
    uploadSessionId,
  });

  await uploadFileToPresignedUrl({
    uri: params.uri,
    putUrl: presignedInfo.putUrl,
    headers: presignedInfo.headers,
    contentType: params.contentType,
  });

  return presignedInfo.key;
}
