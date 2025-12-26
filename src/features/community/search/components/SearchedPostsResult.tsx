import { textStyle, theme } from '@/src/styles/theme';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import PostListCard from '../../post/components/PostListCard';
import { AllowedCategory, PostsListItem } from '../../post/types';
import { CATEGORY_TO_BOARD_ID } from '../../shared/constants/constants';
import { ErrorContainer, ErrorText, RetryButton, RetryButtonText } from '../../shared/styles/styles';
import { useGetSearchedPosts } from '../hooks/useGetSearchedPosts';

type SearchedPostsResultProps = {
  category: AllowedCategory;
  value: string;
};

const SearchedPostsResult = ({ category, value }: SearchedPostsResultProps) => {
  const { items, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, isError, refetch, isRefetching } =
    useGetSearchedPosts(CATEGORY_TO_BOARD_ID[category], value);

  const renderPost: ListRenderItem<PostsListItem> = ({ item }) => <PostListCard data={item} />;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading && !items?.length) {
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
    <Container>
      <FlatList
        data={items ?? []}
        renderItem={renderPost}
        onRefresh={() => refetch()}
        refreshing={isRefetching}
        onEndReachedThreshold={0.4}
        onEndReached={handleLoadMore}
        initialNumToRender={10}
        keyExtractor={(item, index) => `${item.postId}-${index}`}
        ListEmptyComponent={
          <NoResultsContainer>
            <NoResultsText>Ooops...</NoResultsText>
            <NoResultsSubText>There is no Search Results.</NoResultsSubText>
          </NoResultsContainer>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <FooterLoading>
              <ActivityIndicator />
            </FooterLoading>
          ) : null
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      />
    </Container>
  );
};

export default SearchedPostsResult;

const Container = styled.View`
  flex: 1;
`;

const NoResultsContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const NoResultsText = styled.Text`
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.Serif.H1_R)};
`;

const NoResultsSubText = styled.Text`
  margin-top: 8px;
  color: #cccccc;
  ${({ theme }) => textStyle(theme.fonts.body.B4_R)};
`;
const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const FooterLoading = styled.View`
  padding: 16px 0;
`;
