import { CATEGORY_TO_BOARD_ID } from '@/lib/community/constants';
import React, { RefObject } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { useGetPosts } from '../hooks/useGetPosts';
import { AllowedCategory, PostsListItem, SortParam } from '../types/postsListType';
import PostListCard from './PostListCard';

type Props = {
  category: AllowedCategory;
  sort: SortParam;
  scrollRef: RefObject<FlatList<PostsListItem> | null>;
};

const PostList = ({ category, sort, scrollRef }: Props) => {
  const { data, posts, isLoading, isFetchingNextPage, isError, hasNextPage, refetch, isRefetching, fetchNextPage } =
    useGetPosts(CATEGORY_TO_BOARD_ID[category], sort);

  const renderPost: ListRenderItem<PostsListItem> = ({ item }) => (
    <PostListCard data={item} sort={sort} category={category} />
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
      refreshing={isRefetching}
      onRefresh={refetch}
      ListFooterComponent={
        isLoading || isFetchingNextPage ? (
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
