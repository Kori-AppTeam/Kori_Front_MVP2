import ProfileImage from '@/components/common/ProfileImage';
import { CHAT_ROUTE } from '@/src/shared/constants/route';
import { formatTime } from '@/src/shared/utils/dateUtils';
import { useRouter } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';
import { MyChatRoom } from '../types';

export const MyChatList = ({ data }: { data: MyChatRoom }) => {
  const router = useRouter();
  console.info(data);

  //채팅방 진입
  const enterChattingRoom = async () => {
    router.push({
      pathname: `${CHAT_ROUTE(data.roomId)}`,
      params: {
        roomName: data.roomName,
      },
    });
  };

  return (
    <ChatRoomWrapper>
      <RoomBox activeOpacity={0.8} onPress={enterChattingRoom}>
        <RoomImageContainer>
          <RoomImage imageUrl={data.roomImageUrl} isVisitor={!data.roomImageUrl} />
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
  background-color: ${({ theme }) => theme.colors.primary.black};
  height: 80px;
  justify-content: center;
`;

const RoomBox = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary.black};
  padding-top: 8px;
  height: 80px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.gray.darkGray_1};
`;

const RoomImageContainer = styled.View`
  width: 60px;
  height: 60px;
  align-items: center;
  justify-content: center;
`;

const RoomImage = styled(ProfileImage)`
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
  margin-left: 5px;
  ${({ theme }) => theme.fonts.body.B2_M};
  color: ${({ theme }) => theme.colors.primary.white};
  flex-shrink: 1;
`;

const ChatPeople = styled.Text`
  margin-left: 8px;
  ${({ theme }) => theme.fonts.body.B5_M};
  color: ${({ theme }) => theme.colors.primary.mint};
`;

const ChatTime = styled.Text`
  ${({ theme }) => theme.fonts.small.small_L};
  color: ${({ theme }) => theme.colors.primary.white};
`;

const ChatContent = styled.Text<{ textColor?: boolean }>`
  margin-left: 5px;
  color: ${(props) => (props.textColor ? `${props.theme.colors.primary.white}` : `${props.theme.colors.gray.gray_1}`)};
  ${({ theme }) => theme.fonts.body.B4_L};
  flex: 1;
`;

const ChatCountBox = styled.View`
  background-color: ${({ theme }) => theme.colors.primary.mint};
  width: 23px;
  height: 23px;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
`;

const ChatCount = styled.Text`
  ${({ theme }) => theme.fonts.small.small_SB};
  font-size: 9px;
  color: ${({ theme }) => theme.colors.primary.black};
`;
