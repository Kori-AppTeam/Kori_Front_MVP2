import { ChatMember } from '@/src/features/chat/member/types';
import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { MemberItem } from './MemberItem';

interface MembersListProps {
  members: ChatMember[];
  onPressProfile: (userId: number) => void;
  onPressMore: (userId: number, firstName: string) => void;
}

/**
 * 채팅방 멤버 리스트 컴포넌트
 * FlatList로 멤버 목록을 렌더링
 */
export const MembersList: React.FC<MembersListProps> = ({ members, onPressProfile, onPressMore }) => {
  return (
    <MembersContainer>
      <MemberCountText>Members ({members.length})</MemberCountText>
      <FlatList
        data={members}
        keyExtractor={(item) => String(item.userId)}
        renderItem={({ item }) => (
          <MemberItem
            name={item.firstName}
            isHost={item.isHost}
            imageUrl={item.userImageUrl}
            onPressProfile={() => onPressProfile(item.userId)}
            onPressMore={() => onPressMore(item.userId, item.firstName)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </MembersContainer>
  );
};

const MembersContainer = styled.View`
  flex: 1;
  margin-top: 24px;
`;

const MemberCountText = styled.Text`
  color: #ffffff;
  font-family: PlusJakartaSans_600SemiBold;
  font-size: 16px;
  margin-bottom: 12px;
`;
