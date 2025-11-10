// ChatHeader & SearchHeader 조합
import React from 'react';
import styled from 'styled-components/native';
import { HeaderProps } from '../../types/chat-ui.types';
import ChatHeader from './ChatHeader';
import SearchHeader from './SearchHeader';

const Header: React.FC<HeaderProps> = ({
  roomName,
  isSearchMode,
  searchText,
  onBack,
  onSearchToggle,
  onSearchTextChange,
  onSearchSubmit,
  onShowMembers,
}) => {
  return (
    <HeaderContainer>
      {isSearchMode ? (
        <SearchHeader
          searchText={searchText}
          onSearchTextChange={onSearchTextChange}
          onSearchSubmit={onSearchSubmit}
          onSearchCancel={onSearchToggle}
        />
      ) : (
        <ChatHeader
          roomName={roomName}
          onBack={onBack}
          onShowMembers={onShowMembers}
          onSearchToggle={onSearchToggle}
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