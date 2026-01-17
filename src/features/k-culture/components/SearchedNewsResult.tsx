import NoResult from '@/src/shared/components/NoResult';
import { theme } from '@/src/styles/theme';
import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { useGetSearchedNews } from '../hooks/useGetSearchedNews';
import { KNewsListData } from '../types';
import KNewsItem from './KNewsItem';

type SearchedNewsResultProps = {
  value: string;
};

const SearchedNewsResult = ({ value }: SearchedNewsResultProps) => {
  const { items, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetSearchedNews(value);

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
      <FlatList
        data={items}
        keyExtractor={(item) => item.contentId.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<NoResult />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <Separator />}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      />
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
