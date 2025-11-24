import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toggleBookMark } from '../apis/bookmarks';
import { BoardId, PostDetail, PostsListItem, PostsListResp, SortParam } from '../types/postsListType';

type Vars = { postId: number; isBookmarked: boolean };
type Context = { prevListData?: InfiniteData<PostsListResp>; prevDetailData?: PostDetail };

export function useToggleBookmark(boardId: BoardId, sort: SortParam) {
  const qc = useQueryClient();

  return useMutation<boolean, AxiosError, Vars, Context>({
    mutationFn: ({ postId, isBookmarked }) => toggleBookMark(postId, isBookmarked),
    onMutate: async ({ postId, isBookmarked }): Promise<Context> => {
      await qc.cancelQueries({ queryKey: ['post-list'] });
      await qc.cancelQueries({ queryKey: ['post-detail', postId] });

      const prevListData = qc.getQueryData<InfiniteData<PostsListResp>>(['post-list', boardId, sort]);
      const prevDetailData = qc.getQueryData<PostDetail>(['post-detail', postId]);

      // 전체 리스트
      qc.setQueriesData({ queryKey: ['post-list'] }, (oldListData: InfiniteData<PostsListResp>) => {
        if (!oldListData) return [];

        const newPage = oldListData.pages.map((page) => {
          const newData: PostsListItem[] = page.data.items.map((item) => {
            return item.postId === postId ? { ...item, isBookmarked: !isBookmarked } : item;
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

        return { ...oldData, isBookmarked: !isBookmarked };
      });

      return { prevListData, prevDetailData };
    },
    onError: (error, { postId, isBookmarked }, context) => {
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
