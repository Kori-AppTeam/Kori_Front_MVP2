import { useMutation } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import { uploadImageToPresignedUrl } from '../../shared/utils/uploadImage';
import { getPresignedUrls } from '../apis/images';
import { ImageAsset } from '../types';

type UploadImagesParams = {
  images: ImageAsset[];
  imageType: 'POST' | 'COMMENT';
};

type UploadImagesResult = {
  keys: string[];
};

/*
이미지 업로드 전체 프로세스 처리
 * 1. Presigned URL 받기
 * 2. 실제 이미지 업로드
 * 3. 업로드된 키 반환
 */
export function useUploadImages() {
  return useMutation<UploadImagesResult, Error, UploadImagesParams>({
    mutationFn: async ({ images, imageType }) => {
      if (images.length === 0) {
        return { keys: [] };
      }

      const uploadSessionId = Crypto.randomUUID();
      const files = images.map((item, idx) => ({
        filename: item.name ?? `IMG_${Date.now()}_${idx}.jpg`,
        contentType: item.type ?? 'image/jpeg',
      }));

      // Presigned URL 받기
      const presignRes = await getPresignedUrls({ imageType, uploadSessionId, files });

      // 실제 업로드
      await Promise.all(
        presignRes.map((p, i) =>
          uploadImageToPresignedUrl({
            putUrl: p.putUrl,
            headers: { ...p.headers, 'Content-Type': images[i].type ?? 'image/jpeg' },
            fileUri: images[i].uri,
          }),
        ),
      );

      // 업로드된 키 반환
      return { keys: presignRes.map((p) => p.key) };
    },
  });
}
