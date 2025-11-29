import { CATEGORY_TO_BOARD_ID } from '@/lib/community/constants';
import React, { RefObject, useCallback } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { useGetPosts } from '../hooks/useGetPosts';
import { AllowedCategory, PostsListItem, SortParam } from '../types';
import PostListCard from './PostListCard';

type Props = {
  category: AllowedCategory;
  sort: SortParam;
  scrollRef: RefObject<FlatList<PostsListItem> | null>;
  openModal: (postId: number, authorId: number) => void;
};

const PostList = ({ category, sort, scrollRef, openModal }: Props) => {
  const { data, posts, isLoading, isFetchingNextPage, isError, hasNextPage, refetch, isRefetching, fetchNextPage } =
    useGetPosts(CATEGORY_TO_BOARD_ID[category], sort);

  const renderPost: ListRenderItem<PostsListItem> = useCallback(
    ({ item }) => <PostListCard data={item} onOpenModal={openModal} />,
    [openModal],
  );

  return (
    <FlatList
      data={posts}
      ref={scrollRef}
      keyExtractor={(item: PostsListItem) => String(item.postId)}
      renderItem={renderPost}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.4}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      refreshing={!isLoading && isRefetching}
      onRefresh={() => refetch()}
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
