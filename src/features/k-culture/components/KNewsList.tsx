import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { useGetKnews } from '../hooks/useGetKnews';
import { KNewsListData, NewsSortType, NewsType } from '../types';
import KNewsHeader from './KNewsHeader';
import KNewsItem from './KNewsItem';

const KNewsList = () => {
  const [category, setCategory] = useState<NewsType>('K-POP');
  const [sort, setSort] = useState<NewsSortType>('TRENDING');

  const { items, isLoading, isFetchingNextPage, isError, hasNextPage, refetch, isRefetching, fetchNextPage } =
    useGetKnews(category, sort);

  const renderHeaderItem = useMemo(
    () => <KNewsHeader selectedCategory={category} setSelectedCategory={setCategory} sort={sort} setSort={setSort} />,
    [category, sort],
  );

  const renderItem: ListRenderItem<KNewsListData> = useCallback(({ item }) => <KNewsItem data={item} />, []);

  const listEmpty = useMemo(
    () => (
      <Empty>
        <EmptyText>No news available.</EmptyText>
      </Empty>
    ),
    [],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
      data={items ?? []}
      keyExtractor={(item: KNewsListData) => String(item.contentId)}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={renderHeaderItem}
      ListEmptyComponent={
        isLoading && !items?.length ? (
          <LoadingContainer>
            <ActivityIndicator />
          </LoadingContainer>
        ) : (
          listEmpty
        )
      }
      refreshing={isRefetching}
      onRefresh={() => refetch()}
      onEndReachedThreshold={0.4}
      initialNumToRender={10}
      onEndReached={handleLoadMore}
      ItemSeparatorComponent={() => <Separator />}
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

export default KNewsList;

const FooterLoading = styled.View`
  padding: 16px 0;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Empty = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
`;

const EmptyText = styled.Text`
  color: ${({ theme }) => theme.colors.gray.lightGray_1};
  font-size: 14px;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  gap: 16px;
`;

const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.gray.lightGray_1};
  font-size: 14px;
`;

const RetryButton = styled.Pressable`
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.primary.mint};
  border-radius: 8px;
`;

const RetryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.black};
  font-size: 14px;
  font-weight: 600;
`;

const Separator = styled.View`
  height: 20px;
`;
