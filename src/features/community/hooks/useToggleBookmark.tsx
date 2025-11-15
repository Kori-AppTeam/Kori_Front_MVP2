import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toggleBookMark } from '../apis/bookmarks';

type Vars = { postId: number; isBookmarked: boolean };

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation<boolean, AxiosError, Vars>({
    mutationFn: ({ postId, isBookmarked }) => toggleBookMark(postId, isBookmarked),
    onSuccess: () => {
      // 나중에 좋아요랑 같이 로직 수정 필요 -> 스크롤 새로고침 되지 않도록 처리
      queryClient.invalidateQueries({ queryKey: ['post-list'] });
    },
  });
}
