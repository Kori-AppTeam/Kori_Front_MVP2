import NoResult from '@/src/shared/components/NoResult';
import { theme } from '@/src/styles/theme';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { useGetSearchedNews } from '../hooks/useGetSearchedNews';
import { KNewsListData } from '../types';
import KNewsItem from './KNewsItem';

type SearchedNewsResultProps = {
  value: string;
};

const SearchedNewsResult = ({ value }: SearchedNewsResultProps) => {
  const queryClient = useQueryClient();
  const { items, hasNextPage, fetchNextPage, isFetchingNextPage, isSuccess, isFetching } = useGetSearchedNews(value);

  useEffect(() => {
    if (isSuccess && !isFetching) {
      queryClient.invalidateQueries({ queryKey: ['recentNewsSearches'] });
    }
  }, [isSuccess, isFetching, queryClient]);

  const renderItem: ListRenderItem<KNewsListData> = useCallback(
    ({ item }) => <KNewsItem data={item} routeFromSearch={true} />,
    [],
  );

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Container>
      {isFetching && items.length === 0 ? (
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary.white} />
        </LoadingContainer>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.contentId.toString()}
          renderItem={renderItem}
          ListEmptyComponent={() => isSuccess && !isFetching && value.length > 0 && <NoResult />}
          ListFooterComponent={
            isFetchingNextPage ? (
              <FooterLoading>
                <ActivityIndicator />
              </FooterLoading>
            ) : null
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent={() => <Separator />}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        />
      )}
    </Container>
  );
};

export default SearchedNewsResult;

const Container = styled.View`
  flex: 1;
  padding: 10px 0;
  background-color: ${theme.colors.primary.black};
`;

const Separator = styled.View`
  height: 20px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FooterLoading = styled.View`
  padding: 16px 0;
`;
