import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../apis/write';
import { CreatePostWithImagesParams } from '../types';
import { useUploadImages } from './useWritePresignedUpload';

/**
 * 이미지와 함께 게시글 생성
 * 이미지가 있으면 먼저 업로드 후 게시글 생성
 */
export function useCreatePostWithImages(boardId?: number) {
  const qc = useQueryClient();
  const uploadImages = useUploadImages();

  return useMutation<void, Error, CreatePostWithImagesParams>({
    mutationFn: async ({ content, isAnonymous, images = [] }) => {
      if (!boardId) throw new Error('boardId is required');

      // 이미지 업로드 - 키 추출
      const { keys } = await uploadImages.mutateAsync({ images, imageType: 'POST' });

      // 게시글 생성
      await createPost(boardId, {
        content,
        isAnonymous,
        imageUrls: keys,
      });
    },
    onSuccess: () => {
      if (!boardId) return;
      qc.invalidateQueries({ queryKey: ['post'] });
    },
  });
}
