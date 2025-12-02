import { InfiniteData, QueryClient, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toggleBookMark } from '../apis/bookmarks';
import { BookmarkedPostsResp, PostDetail, PostsListResp } from '../types';

type Vars = { postId: number; isBookmarked: boolean };
type Context = {
  prevListData?: Array<[QueryKey, InfiniteData<PostsListResp> | undefined]>;
  prevDetailData?: PostDetail;
  prevBookmarkData?: Array<[QueryKey, InfiniteData<BookmarkedPostsResp> | undefined]>;
};

export function useToggleBookmark() {
  const qc = useQueryClient();

  return useMutation<boolean, AxiosError, Vars, Context>({
    mutationFn: ({ postId, isBookmarked }) => toggleBookMark(postId, isBookmarked),
    onMutate: async ({ postId, isBookmarked }): Promise<Context> => {
      await Promise.all([
        qc.cancelQueries({ queryKey: ['post-list'] }),
        qc.cancelQueries({ queryKey: ['bookmarked-posts'] }),
        qc.cancelQueries({ queryKey: ['post-detail', postId] }),
      ]);

      const prevListData = qc.getQueriesData({ queryKey: ['post-list'] }) as Array<
        [QueryKey, InfiniteData<PostsListResp>]
      >;
      const prevBookmarkData = qc.getQueriesData({ queryKey: ['bookmarked-posts'] }) as Array<
        [QueryKey, InfiniteData<BookmarkedPostsResp>]
      >;
      const prevDetailData = qc.getQueryData<PostDetail>(['post-detail', postId]);

      updateBookmarkListCache(qc, ['post-list'], postId, isBookmarked);
      updateBookmarkDetailCache(qc, postId, isBookmarked);
      updateBookmarkListCache(qc, ['bookmarked-posts'], postId, isBookmarked);

      return { prevListData, prevDetailData, prevBookmarkData };
    },
    onError: (error, { postId, isBookmarked }, context) => {
      if (context?.prevDetailData) {
        qc.setQueryData(['post-detail', postId], context.prevDetailData);
      }
      if (context?.prevListData) {
        context.prevListData.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data);
        });
      }
      if (context?.prevBookmarkData) {
        context.prevBookmarkData.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (data, errors, { isBookmarked }) => {
      // 북마크 해제 시 북마크 페이지 안에 있으면 refetch 하지 않고 데이터가 상했다는 표시만 전달
      if (!isBookmarked) {
        qc.invalidateQueries({ queryKey: ['bookmarked-posts'], refetchType: 'none' });
      }
    },
  });
}

// 커뮤니티, 북마크 게시글 리스트 캐시 업데이트
const updateBookmarkListCache = (
  qc: QueryClient,
  selectedQueryKey: QueryKey,
  postId: number,
  isBookmarked?: boolean,
) => {
  qc.setQueriesData(
    { queryKey: selectedQueryKey },
    (oldListData: InfiniteData<BookmarkedPostsResp | PostsListResp>) => {
      if (!oldListData) return [];

      return {
        ...oldListData,
        pages: oldListData.pages.map((page) => {
          return {
            ...page,
            data: {
              ...page.data,
              items: page.data.items.map((item) => {
                return item.postId === postId ? { ...item, isBookmarked: !isBookmarked } : item;
              }),
            },
          };
        }),
      };
    },
  );
};

// 상세 게시글 캐시 업데이트
const updateBookmarkDetailCache = (qc: QueryClient, postId: number, isBookmarked: boolean) => {
  qc.setQueryData(['post-detail', postId], (oldData: PostDetail) => {
    if (!oldData) return undefined;
    return { ...oldData, isBookmarked: !isBookmarked };
  });
};
