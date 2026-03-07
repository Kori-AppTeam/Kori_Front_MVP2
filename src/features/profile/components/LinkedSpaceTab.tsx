import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Empty, EmptyText, ErrorText, RetryButton, RetryButtonText } from '../../community/shared/styles/styles';
import { AllSpaceItem } from '../../linked-space/list/components/AllSpaceItem';
import { useGetUserLinkedSpace } from '../hooks/useGetUserLinkedSpace';

interface LinkedSpaceTabProps {
  userId: number;
}

const LinkedSpaceTab = ({ userId }: LinkedSpaceTabProps) => {
  const { linkedSpaces, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage, isRefetching, refetch } =
    useGetUserLinkedSpace(userId);

  const listEmpty = useMemo(
    () => (
      <Empty>
        <EmptyText>No group chats yet.</EmptyText>
      </Empty>
    ),
    [],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator />
      </LoadingContainer>
    );
  }

  if (isError || !linkedSpaces) {
    return (
      <Container>
        <ErrorText>Failed to load linked spaces.</ErrorText>
        <RetryButton onPress={() => refetch()}>
          <RetryButtonText>Try Again</RetryButtonText>
        </RetryButton>
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={linkedSpaces}
        keyExtractor={(item) => item.roomId.toString()}
        renderItem={({ item }) => <AllSpaceItem data={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={listEmpty}
        refreshing={isRefetching}
        onRefresh={() => refetch()}
        onEndReachedThreshold={0.4}
        initialNumToRender={15}
        onEndReached={handleLoadMore}
        ListFooterComponent={
          isFetchingNextPage ? (
            <FooterLoading>
              <ActivityIndicator />
            </FooterLoading>
          ) : null
        }
      />
    </Container>
  );
};

export default LinkedSpaceTab;

const Container = styled.View`
  flex: 1;
  padding: 5px 20px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FooterLoading = styled.View`
  padding: 20px;
  justify-content: center;
  align-items: center;
`;
