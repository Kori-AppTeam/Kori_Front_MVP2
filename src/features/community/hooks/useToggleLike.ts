import { toggleLike } from '@/src/features/community/apis/likes';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { BoardId, PostDetail, PostsListItem, PostsListResp, SortParam } from '../types/postsListType';

type Vars = { postId: number; liked: boolean };
type Context = { prevListData?: InfiniteData<PostsListResp>; prevDetailData?: PostDetail };

export function useToggleLike(boardId: BoardId, sort: SortParam) {
  const qc = useQueryClient();

  return useMutation<boolean, AxiosError, Vars, Context>({
    mutationFn: ({ postId, liked }) => toggleLike(postId, liked),
    onMutate: async ({ postId, liked }): Promise<Context> => {
      await qc.cancelQueries({ queryKey: ['post-list'] });
      await qc.cancelQueries({ queryKey: ['post-detail', postId] });

      const delta = liked ? -1 : +1;

      const prevListData = qc.getQueryData<InfiniteData<PostsListResp>>(['post-list', boardId, sort]);
      const prevDetailData = qc.getQueryData<PostDetail>(['post-detail', postId]);

      // 전체 리스트
      qc.setQueriesData({ queryKey: ['post-list'] }, (oldListData: InfiniteData<PostsListResp>) => {
        if (!oldListData) return [];

        const newPage = oldListData.pages.map((page) => {
          const newData: PostsListItem[] = page.data.items.map((item) => {
            const prev = Number(item.likeCount ?? 0);
            return item.postId === postId
              ? { ...item, isLiked: !liked, likeCount: prev + delta < 999 ? Math.max(0, prev + delta) : 999 }
              : item;
          });
          return {
            ...page,
            data: {
              ...page.data,
              items: newData,
            },
          };
        });
        return {
          ...oldListData,
          pages: newPage,
        };
      });

      //상세 게시글
      qc.setQueryData(['post-detail', postId], (oldData: PostDetail) => {
        if (!oldData) return undefined;

        const prev = Number(oldData.likeCount ?? 0);
        return { ...oldData, isLiked: !liked, likeCount: prev + delta < 999 ? Math.max(0, prev + delta) : 999 };
      });

      return { prevListData, prevDetailData };
    },
    onError: (error, { postId, liked }, context) => {
      if (context?.prevDetailData) {
        qc.setQueryData(['post-detail', postId], context.prevDetailData);
      }
      if (context?.prevListData) {
        qc.setQueriesData({ queryKey: ['post-list', boardId, sort] }, context.prevListData);
      } else {
        qc.invalidateQueries({ queryKey: ['post-list'] });
      }
    },
  });
}
