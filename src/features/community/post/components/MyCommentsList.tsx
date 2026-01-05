import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { Empty, EmptyText, ErrorContainer, ErrorText, RetryButton, RetryButtonText } from '../../shared/styles/styles';
import { useGetMyHistoryComments } from '../hooks/comment/useGetMyHistoryComments';
import { MyHistoryComment } from '../types';
import MyCommentCard from './MyCommentCard';

interface MyCommentsListProps {
  authorId?: number;
}

const MyCommentsList = ({ authorId }: MyCommentsListProps) => {
  const myCommentsQuery = useGetMyHistoryComments();

  const renderComment: ListRenderItem<MyHistoryComment> = useCallback(
    ({ item }) => {
      return <MyCommentCard data={item} authorId={authorId} />;
    },
    [authorId],
  );

  const listEmpty = useMemo(
    () => (
      <Empty>
        <EmptyText>No comments yet.</EmptyText>
      </Empty>
    ),
    [],
  );

  const handleLoadMore = useCallback(() => {
    if (myCommentsQuery.hasNextPage && !myCommentsQuery.isFetchingNextPage) {
      myCommentsQuery.fetchNextPage();
    }
  }, [myCommentsQuery.hasNextPage, myCommentsQuery.isFetchingNextPage, myCommentsQuery.fetchNextPage]);

  if (myCommentsQuery.isLoading && !myCommentsQuery.items?.length) {
    return (
      <LoadingContainer>
        <ActivityIndicator />
      </LoadingContainer>
    );
  }

  if (myCommentsQuery.isError) {
    return (
      <ErrorContainer>
        <ErrorText>An error occurred.</ErrorText>
        <RetryButton onPress={() => myCommentsQuery.refetch()}>
          <RetryButtonText>Try Again</RetryButtonText>
        </RetryButton>
      </ErrorContainer>
    );
  }

  return (
    <FlatList
      data={myCommentsQuery.items ?? []}
      keyExtractor={(it: MyHistoryComment) => String(it.commentId)}
      renderItem={renderComment}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={listEmpty}
      refreshing={myCommentsQuery.isRefetching}
      onRefresh={() => myCommentsQuery.refetch()}
      onEndReachedThreshold={0.4}
      initialNumToRender={10}
      onEndReached={handleLoadMore}
      ListFooterComponent={
        myCommentsQuery.isFetchingNextPage ? (
          <FooterLoading>
            <ActivityIndicator />
          </FooterLoading>
        ) : null
      }
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
};

export default MyCommentsList;

const FooterLoading = styled.View`
  padding: 16px 0;
`;
const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
