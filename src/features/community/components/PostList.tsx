import { CATEGORY_TO_BOARD_ID } from '@/lib/community/constants';
import React, { RefObject } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { useGetPosts } from '../hooks/useGetPosts';
import { useToggleBookmark } from '../hooks/useToggleBookmark';
import { useToggleLike } from '../hooks/useToggleLike';
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

  const likeMutation = useToggleLike(CATEGORY_TO_BOARD_ID[category], sort);
  const bookmarkMutation = useToggleBookmark(CATEGORY_TO_BOARD_ID[category], sort);

  const handleToggleLike = (postId: number, isLike: boolean) => {
    likeMutation.mutate({ postId: postId, liked: isLike });
  };

  const handleToggleBookmark = (postId: number, isBookmark: boolean) => {
    bookmarkMutation.mutate({ postId: postId, isBookmarked: isBookmark });
  };

  const renderPost: ListRenderItem<PostsListItem> = ({ item }) => (
    <PostListCard
      data={item}
      onToggleBookmark={() => handleToggleBookmark(item.postId, item.isBookmarked)}
      onToggleLike={() => handleToggleLike(item.postId, item.isLiked)}
    />
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

const FooterLoading = styled.View`
  padding: 16px 0;
`;

export default PostList;
