import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useAllSpaces, useBuzzingSpaces } from '../hooks/useGroupChatRooms';
import { AllSpaceItem } from './AllSpaceItem';
import { GroupChatListFooter } from './GroupChatListFooter';
import { GroupChatListHeader } from './GroupChatListHeader';

// 🔹 memo 적용

export const GroupChatList = () => {
  const { data: buzzingSpaces } = useBuzzingSpaces();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useAllSpaces();

  const allSpaces = data?.pages.flat() ?? [];

  return (
    <Container>
      <FlatList
        data={allSpaces}
        renderItem={({ item }) => <AllSpaceItem data={item} />}
        keyExtractor={(item) => item.roomId.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<GroupChatListHeader buzzingSpaces={buzzingSpaces ?? []} />}
        ListFooterComponent={<GroupChatListFooter isLoading={isFetchingNextPage} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </Container>
  );
};

// 🔹 스타일
const Container = styled.View`
  flex: 1;
`;
