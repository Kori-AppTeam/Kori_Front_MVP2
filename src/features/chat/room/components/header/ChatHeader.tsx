// 채팅방 상단 헤더 컴포넌트
import Icon from '@/components/common/Icon';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useChatStore } from '../../stores/useChatStore';
import { ChatHeaderProps } from '../../types';

const ChatHeader: React.FC<ChatHeaderProps> = ({ roomName, onShowMembers, onSearchToggle }) => {
  const router = useRouter();

  const isTranslating = useChatStore((state) => state.isTranslating);
  const setIsTranslating = useChatStore((state) => state.setIsTranslating);

  const onToggle = () => {
    setIsTranslating(!isTranslating);
  };

  return (
    <>
      <LeftSection>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/chat')}>
          <Icon type="previous" size={HEADER_CONFIG.ICON_SIZE} />
        </TouchableOpacity>
      </LeftSection>

      <CenterSection>
        <HeaderTitleText>{roomName}</HeaderTitleText>
      </CenterSection>

      <RightSection>
        <TouchableOpacity onPress={onSearchToggle}>
          <Icon type="search" size={HEADER_CONFIG.ICON_SIZE} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onToggle}>
          <Icon type={isTranslating ? 'translateOn' : 'translateOff'} size={HEADER_CONFIG.ICON_SIZE} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onShowMembers}>
          <Icon type="hamburger" size={HEADER_CONFIG.ICON_SIZE} />
        </TouchableOpacity>
      </RightSection>
    </>
  );
};

export default ChatHeader;

// ============= Constants =============
const HEADER_CONFIG = {
  SECTION_WIDTH: 60,
  ICON_SIZE: 24,
  TITLE_FONT_SIZE: 18,
  TITLE_COLOR: '#ffffff',
} as const;

// ============= Base Styled Components =============
const BaseSection = styled.View`
  width: ${HEADER_CONFIG.SECTION_WIDTH}px;
`;

// ============= Styled Components =============
const LeftSection = styled(BaseSection)`
  align-items: flex-start;
`;

const CenterSection = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const RightSection = styled(BaseSection)`
  flex-direction: row;
  justify-content: flex-end;
  gap: 5px;
`;

const HeaderTitleText = styled.Text`
  color: ${HEADER_CONFIG.TITLE_COLOR};
  font-family: PlusJakartaSans_500Medium;
  font-size: ${HEADER_CONFIG.TITLE_FONT_SIZE}px;
`;
