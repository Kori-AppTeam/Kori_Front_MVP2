import { toggleLike } from '@/src/features/community/apis/likes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

type Vars = { postId: number; liked: boolean };

export function useToggleLike() {
  const qc = useQueryClient();

  return useMutation<boolean, AxiosError, Vars>({
    mutationFn: ({ postId, liked }) => toggleLike(postId, liked),
    onSuccess: (_ok, { postId, liked }) => {
      const delta = liked ? -1 : +1;

      qc.setQueryData(['post', postId], (old: any) => {
        if (!old) return old;
        const prev = Number(old.likeCount ?? 0);
        return {
          ...old,
          likeCount: prev + delta < 999 ? Math.max(0, prev + delta) : 999,
          likedByMe: !liked,
          isLike: !liked,
          isLiked: !liked,
        };
      });

      // 북마크 훅과 동일하게 수정 필요
      qc.invalidateQueries({ queryKey: ['post-list'] });
    },
  });
}
