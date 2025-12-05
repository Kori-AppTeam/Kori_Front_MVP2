import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { Empty, EmptyText, ErrorContainer, ErrorText, RetryButton, RetryButtonText } from '../../shared/styles/styles';
import { useGetBookmarkedPosts } from '../hooks/useGetBookmarks';
import { BookmarkedPostItem } from '../types';
import BookmarkedPost from './BookmarkedPost';

const BookmarkList = ({ openModal }: { openModal: (postId: number, authorId: number) => void }) => {
  const bookmarkQuery = useGetBookmarkedPosts();
  const renderPost: ListRenderItem<BookmarkedPostItem> = useCallback(
    ({ item }) => {
      return <BookmarkedPost data={item} onOpenModal={openModal} />;
    },
    [openModal],
  );

  const listEmpty = useMemo(
    () => (
      <Empty>
        <EmptyText>No bookmarked posts.</EmptyText>
      </Empty>
    ),
    [],
  );

  // 북마크 화면 포커스 될 때마다 새로고침
  useFocusEffect(
    useCallback(() => {
      bookmarkQuery.refetch();
    }, [bookmarkQuery.refetch]),
  );

  const handleLoadMore = useCallback(() => {
    if (bookmarkQuery.hasNextPage && !bookmarkQuery.isFetchingNextPage) {
      bookmarkQuery.fetchNextPage();
    }
  }, [bookmarkQuery.hasNextPage, bookmarkQuery.isFetchingNextPage, bookmarkQuery.fetchNextPage]);

  if (bookmarkQuery.isLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator />
      </LoadingContainer>
    );
  }

  if (bookmarkQuery.isError) {
    return (
      <ErrorContainer>
        <ErrorText>An error occurred.</ErrorText>
        {/* 버튼을 눌러 다시 시도할 수 있도록 refetch 연결 */}
        <RetryButton onPress={() => bookmarkQuery.refetch()}>
          <RetryButtonText>Try Again</RetryButtonText>
        </RetryButton>
      </ErrorContainer>
    );
  }

  return (
    <FlatList
      data={bookmarkQuery.bookmarkedPosts ?? []}
      keyExtractor={(it: BookmarkedPostItem) => String(it.postId)}
      renderItem={renderPost}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={listEmpty}
      refreshing={bookmarkQuery.isRefetching}
      onRefresh={() => bookmarkQuery.refetch()}
      onEndReachedThreshold={0.4}
      initialNumToRender={10}
      onEndReached={handleLoadMore}
      ListFooterComponent={
        bookmarkQuery.isFetchingNextPage ? (
          <FooterLoading>
            <ActivityIndicator />
          </FooterLoading>
        ) : null
      }
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
};

export default BookmarkList;

const FooterLoading = styled.View`
  padding: 16px 0;
`;
const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
