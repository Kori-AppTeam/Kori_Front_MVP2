import RawProfileImage from '@/components/common/ProfileImage';
import { CHAT_ROUTE } from '@/src/shared/constants/route';
import { formatTime } from '@/src/shared/utils/dateUtils';
import { useRouter } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';
import { ChatRoom } from '../types';

export const MyChatList = ({ data }: { data: ChatRoom }) => {
  const router = useRouter();

  //채팅방 진입
  const enterChattingRoom = async () => {
    router.push({
      pathname: `${CHAT_ROUTE(data.roomId)}`,
      params: {
        roomName: data.roomName
      },
    });
  };

  return (
    <ChatRoomWrapper>
      <RoomBox activeOpacity={0.8} onPress={enterChattingRoom}>
        <RoomImageContainer>
          <RoomImage
            source={
              data.roomImageUrl
                ? { uri: data.roomImageUrl } // URL이 있으면 원격 이미지
                : require('@/assets/images/character1.png') // 없으면 로컬 디폴트 이미지
            }
          />
        </RoomImageContainer>
        <RoomWrapper>
          <RoomTop>
            <ChatPeopleContainer>
              <ChatPerson numberOfLines={1} ellipsizeMode="tail">
                {data.roomName || ''}
              </ChatPerson>
              {data.participantCount > 2 && <ChatPeople>{data.participantCount}</ChatPeople>}
            </ChatPeopleContainer>
            <ChatTime>{formatTime(data.lastMessageTime)}</ChatTime>
          </RoomTop>
          <RoomBottom>
            <ChatContent textColor={data.unreadCount > 0} numberOfLines={1} ellipsizeMode="tail">
              {data.lastMessageContent || ''}
            </ChatContent>
            {data.unreadCount > 0 && (
              <ChatCountBox>
                <ChatCount>{data.unreadCount}</ChatCount>
              </ChatCountBox>
            )}
          </RoomBottom>
        </RoomWrapper>
      </RoomBox>
    </ChatRoomWrapper>
  );
};

// 스타일 정의
const ChatRoomWrapper = styled.View`
  background-color: #1d1e1f;
  height: 80px;
  justify-content: center;
`;

const RoomBox = styled.TouchableOpacity`
  background-color: #1d1e1f;
  padding-top: 8px;
  height: 80px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #353637;
`;

const RoomImageContainer = styled.View`
  width: 60px;
  height: 60px;
  align-items: center;
  justify-content: center;
`;

const RoomImage = styled(RawProfileImage)`
  width: 80%;
  height: 80%;
  border-radius: 30px;
`;

const RoomWrapper = styled.View`
  width: 80%;
  height: 70px;
  flex-direction: column;
`;

const RoomTop = styled.View`
  height: 40%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RoomBottom = styled.View`
  height: 45%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ChatPeopleContainer = styled.View`
  height: 30px;
  margin-top: 5px;
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-right: 8px;
`;

const ChatPerson = styled.Text`
  font-size: 16px;
  margin-left: 5px;
  font-family: 'PlusJakartaSans_500Medium';
  color: #ffffff;
  flex-shrink: 1;
`;

const ChatPeople = styled.Text`
  font-size: 14px;
  margin-left: 8px;
  font-family: 'PlusJakartaSans_500Medium';
  color: #02f59b;
`;

const ChatTime = styled.Text`
  margin-top: 5px;
  font-size: 11px;
  font-family: 'PlusJakartaSans_300Light';
  color: #ffffff;
`;

const ChatContent = styled.Text<{ textColor?: boolean }>`
  font-size: 13px;
  margin-left: 1px;
  color: ${(props) => (props.textColor ? '#ffffff' : '#848687')};
  font-family: 'PlusJakartaSans_300Light';
  flex: 1;
`;

const ChatCountBox = styled.View`
  background-color: #02f59b;
  width: 23px;
  height: 23px;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
`;

const ChatCount = styled.Text`
  font-family: 'PlusJakartaSans_600SemiBold';
  font-size: 9px;
  color: #1d1e1f;
`;
