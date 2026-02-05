import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getHotKeywords, postClickedNewsHotKeyword } from '../apis/search';
import { KNewsSearchListResp } from '../types';

// 뉴스 핫 키워드 조회
export const useGetNewsHotKeyword = () => {
  return useQuery<string[]>({
    queryKey: ['news', 'newHotKeywords'],
    queryFn: async () => getHotKeywords(),
  });
};

// 뉴스 핫 키워드 클릭 후 검색 결과 조회 (무한 스크롤)
export const useGetHotKeywordSearchedNews = (keyword: string, size = 20) => {
  const query = useInfiniteQuery<KNewsSearchListResp>({
    queryKey: ['news', 'hotKeywordSearch', keyword],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => postClickedNewsHotKeyword(keyword, { size, cursor: pageParam as string | undefined }),
    getNextPageParam: (lastPage) => {
      const cursorPage = lastPage.data;
      return cursorPage.hasNext ? (cursorPage.nextCursor ?? undefined) : undefined;
    },
    enabled: !!keyword && keyword.trim().length > 0,
  });

  const items = useMemo(() => query.data?.pages.flatMap((p) => p.data.items.map((i) => i.item)) ?? [], [query.data]);

  return { ...query, items };
};
