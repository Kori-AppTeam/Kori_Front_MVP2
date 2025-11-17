// src/features/chat/room/components/header/Header.tsx
import React from 'react';
import styled from 'styled-components/native';
import { useSearchStore } from '../../stores/useSearchStore';
import { HeaderProps } from '../../types/chat-ui.types';
import ChatHeader from './ChatHeader';
import SearchHeader from './SearchHeader';

const Header: React.FC<HeaderProps> = ({
  roomName,
  onSearchSubmit,
  onShowMembers,
}) => {
  const { isActive, toggleSearch } = useSearchStore();

  return (
    <HeaderContainer>
      {isActive ? (
        <SearchHeader onSearchSubmit={onSearchSubmit} />
      ) : (
        <ChatHeader
          roomName={roomName}
          onShowMembers={onShowMembers}
          onSearchToggle={toggleSearch}
        />
      )}
    </HeaderContainer>
  );
};

export default Header;

// ============= Constants =============
const HEADER_CONFIG = {
  HEIGHT: 70,
} as const;

// ============= Styled Components =============
const HeaderContainer = styled.View`
  flex-direction: row;
  height: ${HEADER_CONFIG.HEIGHT}px;
  align-items: center;
  justify-content: center;
`;