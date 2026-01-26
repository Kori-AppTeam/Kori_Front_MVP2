import { CATEGORY_TO_BOARD_ID } from '@/src/features/community/shared/constants/constants';
import React, { RefObject, useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { Empty, EmptyText, ErrorContainer, ErrorText, RetryButton, RetryButtonText } from '../../shared/styles/styles';
import { useGetPosts } from '../hooks/useGetPosts';
import { AllowedCategory, PostsListItemType, SortParam } from '../types';
import PostListCard from './PostListCard';

type Props = {
  category: AllowedCategory;
  sort: SortParam;
  scrollRef: RefObject<FlatList<PostsListItemType> | null>;
};

const PostList = ({ category, sort, scrollRef }: Props) => {
  const { posts, isLoading, isFetchingNextPage, isError, hasNextPage, refetch, isRefetching, fetchNextPage } =
    useGetPosts(CATEGORY_TO_BOARD_ID[category], sort);

  const renderPost: ListRenderItem<PostsListItemType> = useCallback(({ item }) => <PostListCard data={item} />, []);

  const listEmpty = useMemo(
    () => (
      <Empty>
        <EmptyText>No posts available.</EmptyText>
      </Empty>
    ),
    [],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 초기 로딩 중이면서 데이터가 없을 때만 로딩 표시
  if (isLoading && !posts?.length) {
    return (
      <LoadingContainer>
        <ActivityIndicator />
      </LoadingContainer>
    );
  }

  if (isError) {
    return (
      <ErrorContainer>
        <ErrorText>An error occurred.</ErrorText>
        <RetryButton onPress={() => refetch()}>
          <RetryButtonText>Try Again</RetryButtonText>
        </RetryButton>
      </ErrorContainer>
    );
  }

  return (
    <FlatList
      data={posts ?? []}
      ref={scrollRef}
      keyExtractor={(item: PostsListItemType) => String(item.postId)}
      renderItem={renderPost}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={listEmpty}
      refreshing={isRefetching}
      onRefresh={() => refetch()}
      onEndReachedThreshold={0.4}
      initialNumToRender={10}
      onEndReached={handleLoadMore}
      ListFooterComponent={
        isFetchingNextPage ? (
          <FooterLoading>
            <ActivityIndicator />
          </FooterLoading>
        ) : null
      }
      contentContainerStyle={{ paddingBottom: 80 }}
    />
  );
};

export default PostList;

const FooterLoading = styled.View`
  padding: 16px 0;
`;
const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
