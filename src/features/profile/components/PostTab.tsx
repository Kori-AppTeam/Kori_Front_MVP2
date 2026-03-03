import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { styled } from 'styled-components/native';
import PostListCard from '../../community/post/components/PostListCard';
import {
  Empty,
  EmptyText,
  ErrorContainer,
  ErrorText,
  RetryButton,
  RetryButtonText,
} from '../../community/shared/styles/styles';
import { useGetUserPosts } from '../hooks/useGetUserPosts';

interface PostTabProps {
  userId: number;
}

const PostTab = ({ userId }: PostTabProps) => {
  const { posts, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage, isRefetching, refetch } =
    useGetUserPosts(userId);

  const listEmpty = useMemo(
    () => (
      <Empty>
        <EmptyText>No posts yet.</EmptyText>
      </Empty>
    ),
    [],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator />
      </LoadingContainer>
    );
  }

  if (isError || !posts) {
    return (
      <ErrorContainer>
        <ErrorText>Failed to load posts.</ErrorText>
        <RetryButton onPress={() => refetch()}>
          <RetryButtonText>Try Again</RetryButtonText>
        </RetryButton>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostListCard data={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={listEmpty}
        refreshing={isRefetching}
        onRefresh={() => refetch()}
        onEndReachedThreshold={0.4}
        initialNumToRender={20}
        onEndReached={handleLoadMore}
        ListFooterComponent={
          isFetchingNextPage ? (
            <FooterLoading>
              <ActivityIndicator />
            </FooterLoading>
          ) : null
        }
      />
    </Container>
  );
};

export default PostTab;

const Container = styled.View`
  flex: 1;
  padding: 10px 20px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FooterLoading = styled.View`
  padding: 20px;
  justify-content: center;
  align-items: center;
`;
