import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePost } from '../../post/apis/post';
import { ImageAsset } from '../types';
import { useUploadImages } from './useWritePresignedUpload';

type UpdatePostWithImagesParams = {
  postId: number;
  content: string;
  images: ImageAsset[];
  initialImages: string[];
};

/*
 * 1. 기존 이미지와 신규 이미지 구분
 * 2. 신규 이미지 업로드
 * 3. 최종 이미지 키 계산
 * 4. 삭제된 이미지 계산
 * 5. 게시글 업데이트
 */
export function useUpdatePostWithImages() {
  const qc = useQueryClient();
  const uploadImages = useUploadImages();

  return useMutation<void, Error, UpdatePostWithImagesParams>({
    mutationFn: async ({ postId, content, images, initialImages }) => {
      // 기존 이미지 (https://)와 신규 이미지 (로컬) 구분
      const existingImageUrls = images.filter((img) => img.uri.startsWith('https://'));
      const newLocalImages = images.filter((img) => !img.uri.startsWith('https://'));

      // 기존 이미지에서 S3 키 추출
      const existingKeys = existingImageUrls.map((img) => extractKeyFromUrl(img.uri));

      // 신규 이미지 업로드
      const { keys: newUploadedKeys } = await uploadImages.mutateAsync({
        images: newLocalImages,
        imageType: 'POST',
      });

      // 최종 이미지 키 = 기존 키 + 신규 업로드 키
      const finalImageKeys = [...existingKeys, ...newUploadedKeys];

      // 삭제된 이미지 계산
      const initialKeys = initialImages.map(extractKeyFromUrl);
      const removedKeys = initialKeys.filter((key) => !finalImageKeys.includes(key));

      // 게시글 업데이트
      await updatePost(postId, {
        content,
        images: finalImageKeys,
        removedImages: removedKeys,
      });
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['post-list'] });
      qc.invalidateQueries({ queryKey: ['bookmarked-posts'] });
      qc.invalidateQueries({ queryKey: ['my-posts'] });
      qc.invalidateQueries({ queryKey: ['post-detail', vars.postId] });
    },
  });
}

// URL에서 S3 키 추출
function extractKeyFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
  } catch {
    // URL 파싱 실패 시 마지막 세그먼트만 사용
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}
