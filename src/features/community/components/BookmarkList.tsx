import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
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

  // 북마크 화면 포커스 될 때마다 새로고침
  useFocusEffect(
    useCallback(() => {
      bookmarkQuery.refetch();
    }, []),
  );

  const listEmpty = useMemo(
    () => (
      <Empty>
        <EmptyText>No bookmarked posts.</EmptyText>
      </Empty>
    ),
    [],
  );

  return (
    <>
      {bookmarkQuery.isLoading ? (
        <>
          <LoadingContainer>
            <ActivityIndicator />
          </LoadingContainer>
        </>
      ) : bookmarkQuery.isError ? (
        'An error occurred. Please try again.'
      ) : (
        <FlatList
          data={bookmarkQuery.bookmarkedPosts}
          keyExtractor={(it: BookmarkedPostItem) => String(it.postId)}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!bookmarkQuery.isLoading ? listEmpty : null}
          refreshing={!bookmarkQuery.isLoading && bookmarkQuery.isRefetching}
          onRefresh={() => bookmarkQuery.refetch()}
          onEndReachedThreshold={0.4}
          initialNumToRender={10}
          onEndReached={() => {
            if (bookmarkQuery.hasNextPage && !bookmarkQuery.isFetchingNextPage) {
              bookmarkQuery.fetchNextPage();
            }
          }}
          ListFooterComponent={
            bookmarkQuery.isFetchingNextPage ? (
              <FooterLoading>
                <ActivityIndicator />
              </FooterLoading>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </>
  );
};

export default BookmarkList;

const Empty = styled.View`
  padding: 40px 16px;
  align-items: center;
`;
const EmptyText = styled.Text`
  color: #cfd4da;
  font-size: 14px;
`;
const FooterLoading = styled.View`
  padding: 16px 0;
`;
const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
