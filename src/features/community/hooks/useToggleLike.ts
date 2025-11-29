import { toggleLike } from '@/src/features/community/apis/likes';
import { InfiniteData, QueryClient, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { BookmarkedPostItem, BookmarkedPostsResp, PostDetail, PostsListItem, PostsListResp } from '../types';

type Vars = { postId: number; liked: boolean };
type Context = {
  prevListData?: Array<[QueryKey, InfiniteData<PostsListResp> | undefined]>;
  prevDetailData?: PostDetail;
  prevBookmarkData?: BookmarkedPostItem[];
};

export function useToggleLike() {
  const qc = useQueryClient();

  return useMutation<boolean, AxiosError, Vars, Context>({
    mutationFn: ({ postId, liked }) => toggleLike(postId, liked),
    onMutate: async ({ postId, liked }): Promise<Context> => {
      await Promise.all([
        qc.cancelQueries({ queryKey: ['post-list'] }),
        qc.cancelQueries({ queryKey: ['post-detail', postId] }),
        qc.cancelQueries({ queryKey: ['bookmarked-posts', postId] }),
      ]);

      const prevListData = qc.getQueriesData({ queryKey: ['post-list'] }) as Array<
        [QueryKey, InfiniteData<PostsListResp>]
      >;
      const prevBookmarkData = qc.getQueryData<BookmarkedPostItem[]>(['bookmarked-posts']);
      const prevDetailData = qc.getQueryData<PostDetail>(['post-detail', postId]);

      updateCommunityListLikeCache(qc, ['post-list'], postId, liked);
      updateCommunityListLikeCache(qc, ['bookmarked-posts'], postId, liked);
      updateCommunityDetailLikeCache(qc, postId, liked);

      return { prevListData, prevDetailData, prevBookmarkData };
    },
    onError: (error, { postId, liked }, context) => {
      // 상세 게시글 복구
      if (context?.prevDetailData) {
        qc.setQueryData(['post-detail', postId], context.prevDetailData);
      }
      // 전체 게시글 복구
      if (context?.prevListData) {
        context.prevListData.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data);
        });
      }
      // 북마크 게시글 복구
      if (context?.prevBookmarkData) {
        qc.setQueriesData({ queryKey: ['bookmarked-posts'] }, context.prevBookmarkData);
      }
    },
  });
}

// 커뮤니티 전체 게시글 리스트 캐시 업데이트
const updateCommunityListLikeCache = (qc: QueryClient, selectedQueryKey: QueryKey, postId: number, liked: boolean) => {
  const delta = liked ? -1 : +1;

  qc.setQueriesData(
    { queryKey: selectedQueryKey },
    (oldListData: InfiniteData<PostsListResp | BookmarkedPostsResp>) => {
      if (!oldListData) return [];

      const newPage = oldListData.pages.map((page) => {
        const newData: (PostsListItem | BookmarkedPostItem)[] = page.data.items.map((item) => {
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
    },
  );
};

// 커뮤니티 상세 게시글 캐시 업데이트
const updateCommunityDetailLikeCache = (qc: QueryClient, postId: number, liked: boolean) => {
  const delta = liked ? -1 : +1;

  qc.setQueryData(['post-detail', postId], (oldData: PostDetail) => {
    if (!oldData) return undefined;

    const prev = Number(oldData.likeCount ?? 0);
    return { ...oldData, isLiked: !liked, likeCount: prev + delta < 999 ? Math.max(0, prev + delta) : 999 };
  });
};
