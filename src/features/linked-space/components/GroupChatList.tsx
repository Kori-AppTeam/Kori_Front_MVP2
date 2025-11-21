import AllSpaceRoomBox from '@/src/features/linked-space/components/AllSpaceRoomBox';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useGroupChatRooms } from '../hooks/useGroupChatRooms';
import { GroupChatListFooter } from './GroupChatListFooter';
import { GroupChatListHeader } from './GroupChatListHeader';

// 🔹 memo 적용

export const GroupChatList = () => {
  const { buzzingSpaces, allSpaces, isLoading, loadMoreSpaces } = useGroupChatRooms();

  return (
    <Container>
      <FlatList
        data={allSpaces}
        renderItem={({ item }) => <AllSpaceRoomBox data={item} />}
        keyExtractor={(item) => item.roomId.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<GroupChatListHeader buzzingSpaces={buzzingSpaces} />}
        ListFooterComponent={<GroupChatListFooter isLoading={isLoading} />}
        onEndReached={loadMoreSpaces}
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
