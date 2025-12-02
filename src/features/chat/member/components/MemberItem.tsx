import Icon from '@/components/common/Icon';
import RawProfileImage from '@/components/common/ProfileImage';
import { theme } from '@/src/styles/theme';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface MemberItemProps {
  name: string;
  isHost: boolean;
  imageUrl?: string;
  onPressProfile: () => void;
  onPressMore: () => void;
}

/**
 * 채팅방 멤버 개별 아이템 컴포넌트
 * 기존 components/MembersBox.tsx에서 이동
 */
export const MemberItem: React.FC<MemberItemProps> = ({ name, isHost, imageUrl, onPressProfile, onPressMore }) => {
  return (
    <MemberContainer>
      <TouchableOpacity onPress={onPressProfile}>
        <ProfileBox>
          <ProfileImage source={{ uri: imageUrl }} />
        </ProfileBox>
      </TouchableOpacity>

      <Memberbox>
        <MemberisHostBox>
          <MemberNameText>{name}</MemberNameText>
          {isHost && (
            <HostBox>
              <HostText>Host</HostText>
            </HostBox>
          )}
        </MemberisHostBox>

        <TouchableOpacity onPress={onPressMore}>
          <Icon type="eclipsisGaro" size={20} color={theme.colors.gray.gray_1} />
        </TouchableOpacity>
      </Memberbox>
    </MemberContainer>
  );
};

const MemberContainer = styled.View`
  height: 70px;
  flex-direction: row;
  margin: 8px 0px;
  align-items: center;
`;

const ProfileBox = styled.View`
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 30px;
`;

const ProfileImage = styled(RawProfileImage)`
  width: 100%;
  height: 100%;
`;

const Memberbox = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 6px;
`;

const MemberisHostBox = styled.View`
  flex-direction: row;
  justify-content: center;
  align-content: center;
`;

const HostBox = styled.View`
  background-color: #02f59b40;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  margin-left: 7px;
  width: 36px;
  height: 20px;
`;

const HostText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  font-size: 11px;
  ${theme.fonts.small.small_M}
  ${({ theme }) => theme.fonts.small.small_M};
`;

const MemberNameText = styled.Text`
  margin-left: 12px;
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => theme.fonts.body.B4_M};
`;
