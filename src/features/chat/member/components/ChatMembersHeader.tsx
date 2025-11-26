import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface ChatMembersHeaderProps {
  roomName: string;
  onBack: () => void;
}

export const ChatMembersHeader: React.FC<ChatMembersHeaderProps> = ({ roomName, onBack }) => {
  return (
    <HeaderContainer>
      <Left>
        <TouchableOpacity onPress={onBack}>
          <Icon type="previous" size={24} color={theme.colors.gray.lightGray_1} />
        </TouchableOpacity>
      </Left>
      <Center>
        <HeaderTitleText>{roomName}</HeaderTitleText>
      </Center>
      <Right>{/* Reserved for future features */}</Right>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.View`
  flex-direction: row;
  height: 10%;
  align-items: center;
  justify-content: center;
`;

const HeaderTitleText = styled.Text`
  color: #ffffff;
  font-family: PlusJakartaSans_500Medium;
  font-size: 18px;
`;

const Left = styled.View`
  flex: 1;
`;

const Center = styled.View`
  flex: 2;
  align-items: center;
`;

const Right = styled.View`
  flex-direction: row;
  flex: 1;
  justify-content: center;
`;
