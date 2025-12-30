import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { Empty, EmptyText, ErrorContainer, ErrorText, RetryButton, RetryButtonText } from '../../shared/styles/styles';
import { useGetMyHistoryPosts } from '../hooks/useGetMyHistoryPosts';
import { MyHistoryPost } from '../types';
import MyHistoryCard from './MyHistoryCard';

interface MyPostsListProps {
  authorId?: number;
}

const MyPostsList = ({ authorId }: MyPostsListProps) => {
  const myPostsQuery = useGetMyHistoryPosts();

  const renderPost: ListRenderItem<MyHistoryPost> = useCallback(({ item }) => {
    return <MyHistoryCard data={item} authorId={authorId} />;
  }, []);

  const listEmpty = useMemo(
    () => (
      <Empty>
        <EmptyText>No posts yet.</EmptyText>
      </Empty>
    ),
    [],
  );

  const handleLoadMore = useCallback(() => {
    if (myPostsQuery.hasNextPage && !myPostsQuery.isFetchingNextPage) {
      myPostsQuery.fetchNextPage();
    }
  }, [myPostsQuery.hasNextPage, myPostsQuery.isFetchingNextPage, myPostsQuery.fetchNextPage]);

  if (myPostsQuery.isLoading && !myPostsQuery.items?.length) {
    return (
      <LoadingContainer>
        <ActivityIndicator />
      </LoadingContainer>
    );
  }

  if (myPostsQuery.isError) {
    return (
      <ErrorContainer>
        <ErrorText>An error occurred.</ErrorText>
        <RetryButton onPress={() => myPostsQuery.refetch()}>
          <RetryButtonText>Try Again</RetryButtonText>
        </RetryButton>
      </ErrorContainer>
    );
  }

  return (
    <FlatList
      data={myPostsQuery.items ?? []}
      keyExtractor={(it: MyHistoryPost) => String(it.postId)}
      renderItem={renderPost}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={listEmpty}
      refreshing={myPostsQuery.isRefetching}
      onRefresh={() => myPostsQuery.refetch()}
      onEndReachedThreshold={0.4}
      initialNumToRender={10}
      onEndReached={handleLoadMore}
      ListFooterComponent={
        myPostsQuery.isFetchingNextPage ? (
          <FooterLoading>
            <ActivityIndicator />
          </FooterLoading>
        ) : null
      }
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
};

export default MyPostsList;

const FooterLoading = styled.View`
  padding: 16px 0;
`;
const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
