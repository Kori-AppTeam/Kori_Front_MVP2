import api from '@/api/axiosInstance';
import Icon from '@/components/common/Icon';
import GroupChatRoomBox from '@/src/features/chat/components/GroupChatRoomBox';
import MyChatRoomBox from '@/src/features/chat/components/MyChatRoomBox';
import { CHAT_SEARCH_ROUTE, CREATE_LINKED_SPACE_ROUTE } from '@/src/shared/constants/route';
import { useStompStore } from '@/src/store/useStompStore';
import { theme } from '@/src/styles/theme';
import { useFocusEffect } from '@react-navigation/native';
import { Client } from '@stomp/stompjs';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';

type ChatRoom = {
  roomId: string; // 채팅방 아이디
  roomName: string; // 채팅방 이름
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
  roomImageUrl?: string;
  participantCount?: number;
};

export default function ChatScreen() {
  const router = useRouter();
  const [chatrooms, setChatRooms] = useState<ChatRoom[]>([]);
  const stompClient = useRef<Client | null>(null);
  const [isGroupChat, setisGroupChat] = useState(true);

  const subscribe = useStompStore((state) => state.subscribe);
  const connected = useStompStore((state) => state.connected);

  const createNewSpace = () => router.push(CREATE_LINKED_SPACE_ROUTE);

  // 🔹 채팅방 목록 가져오기
  const fetchRooms = async () => {
    try {
      const res = await api.get('/api/v1/chat/rooms');

      setChatRooms(res.data.data);
    } catch (err) {
      console.error('채팅방 불러오기 실패:', err);
    }
  };

  // 🔹 화면 focus 될 때마다 채팅방 갱신
  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, []),
  );

  useEffect(() => {
    if (!connected) return;

    let unsubscribe: (() => void) | undefined;

    const setupSubscription = async () => {
      const MyuserId = await SecureStore.getItemAsync('MyuserId');
      const unsubscribe = subscribe(`/topic/user/${MyuserId}/rooms`, (updatedRoom) => {
        setChatRooms((prev) => {
          const filtered = prev.filter((room) => room.roomId !== updatedRoom.roomId);
          return [updatedRoom, ...filtered];
        });
      });

      return unsubscribe;
    };

    setupSubscription()

    return () => {
      unsubscribe?.();
    };
  }, [connected, subscribe]);

  const goSearch = () => {
    router.push({
      pathname: CHAT_SEARCH_ROUTE,
      params: { isGroupChat: String(isGroupChat) },
    });
  };

  return (
    <Safe>
      <Container>
        <Header>
          <TitleWrapper>
            <Title>Chat</Title>
            <IconImage source={require('../../../assets/images/IsolationMode.png')} />
          </TitleWrapper>
          <SearchButton onPress={goSearch}>
            <Icon type="search" size={24} color={theme.colors.gray.lightGray_1} />
          </SearchButton>
        </Header>

        <ChatWrapper>
          <ChatBox>
            <GroupChatBox isGroupChat={isGroupChat} onPress={() => setisGroupChat(true)}>
              <GroupChatText isGroupChat={isGroupChat}>Linked Space</GroupChatText>
            </GroupChatBox>
          </ChatBox>
          <ChatBox>
            <MyChatBox isGroupChat={isGroupChat} onPress={() => setisGroupChat(false)}>
              <MyChatText isGroupChat={isGroupChat}>My chat</MyChatText>
            </MyChatBox>
          </ChatBox>
        </ChatWrapper>

        {!isGroupChat ? (
          <FlatList
            data={chatrooms}
            renderItem={({ item }) => <MyChatRoomBox data={item} />}
            keyExtractor={(item) => item.roomId}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <GroupChatRoomBox />
        )}

        {isGroupChat && (
          <CreateSpaceButton onPress={createNewSpace}>
            <Icon type="plus" size={24} color="black" />
          </CreateSpaceButton>
        )}
      </Container>
    </Safe>
  );
}

// ================= styled-components =================
const Safe = styled.SafeAreaView`
  flex: 1;
  background-color: #1d1e1f;
`;
const Container = styled.View`
  flex: 1;
  padding: 0px 20px;
`;
const Header = styled.View`
  height: 70px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const SearchButton = styled.TouchableOpacity``;
const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Title = styled.Text`
  color: #ffffff;
  font-size: 32px;
  font-family: 'InstrumentSerif_400Regular';
`;
const IconImage = styled.Image`
  margin-left: 4px;
  width: 20px;
  height: 20px;
`;
const ChatWrapper = styled.View`
  height: 50px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #616262;
`;
const ChatBox = styled.View`
  width: 50%;
  height: 50px;
  align-items: center;
  justify-content: center;
`;
const MyChatBox = styled.TouchableOpacity<{ isGroupChat: boolean }>`
  width: 70%;
  height: 50px;
  margin: 0px 100px;
  border-bottom-color: ${(props) => (props.isGroupChat ? '#616262' : '#02F59B')};
  border-bottom-width: ${(props) => (props.isGroupChat ? '1px' : '2px')};
  align-items: center;
  justify-content: center;
`;
const GroupChatBox = styled.TouchableOpacity<{ isGroupChat: boolean }>`
  width: 70%;
  height: 50px;
  border-bottom-color: ${(props) => (props.isGroupChat ? '#02F59B' : '#616262')};
  border-bottom-width: ${(props) => (props.isGroupChat ? '2px' : '1px')};
  align-items: center;
  justify-content: center;
`;
const MyChatText = styled.Text<{ isGroupChat: boolean }>`
  color: ${(props) => (props.isGroupChat ? '#616262' : '#02F59B')};
  font-family: 'PlusJakartaSans_500Medium';
  font-size: 16px;
`;
const GroupChatText = styled.Text<{ isGroupChat: boolean }>`
  color: ${(props) => (props.isGroupChat ? '#02F59B' : '#616262')};
  font-family: 'PlusJakartaSans_500Medium';
  font-size: 16px;
`;
const CreateSpaceButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 30px;
  background-color: #02f59b;
  justify-content: center;
  align-items: center;
  z-index: 999;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 3.84px;
`;
