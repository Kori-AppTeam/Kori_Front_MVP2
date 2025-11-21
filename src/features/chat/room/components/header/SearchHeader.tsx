// src/features/chat/room/components/header/SearchHeader.tsx
import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useSearchStore } from '../../stores/useSearchStore';
import { SearchHeaderProps } from '../../types';

const SearchHeader: React.FC<SearchHeaderProps> = ({ onSearchSubmit }) => {
  const {
    searchText,
    setSearchText,
    toggleSearch,
    clearSearch
  } = useSearchStore();

  const handleCancel = () => {
    clearSearch();
    toggleSearch();
  };

  return (
    <>
      <TouchableOpacity onPress={handleCancel}>
        <Icon
          type="previous"
          size={SEARCH_HEADER_CONFIG.ICON_SIZE}
          color={theme.colors.gray.lightGray_1}
        />
      </TouchableOpacity>

      <SearchInputContainer>
        <Icon
          type="search"
          size={SEARCH_HEADER_CONFIG.ICON_SIZE}
          color={theme.colors.gray.lightGray_1}
        />
        <SearchInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder={SEARCH_HEADER_CONFIG.PLACEHOLDER}
          placeholderTextColor={SEARCH_HEADER_CONFIG.PLACEHOLDER_COLOR}
          onSubmitEditing={onSearchSubmit}
          autoFocus={true}
          returnKeyType="search"
        />
        {searchText && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Icon
              type="close"
              size={SEARCH_HEADER_CONFIG.ICON_SIZE}
              color={SEARCH_HEADER_CONFIG.CLOSE_ICON_COLOR}
            />
          </TouchableOpacity>
        )}
      </SearchInputContainer>
    </>
  );
};

export default SearchHeader;

// ============= Constants =============
const SEARCH_HEADER_CONFIG = {
  ICON_SIZE: 24,
  INPUT_HEIGHT: 45,
  INPUT_WIDTH_RATIO: 0.85,
  INPUT_MARGIN_LEFT: 10,
  INPUT_PADDING_LEFT: 10,
  INPUT_FONT_SIZE: 14,
  BORDER_RADIUS: 8,
  PADDING_HORIZONTAL: 3,
  PLACEHOLDER: 'Search Chat',
  PLACEHOLDER_COLOR: '#616262',
  CLOSE_ICON_COLOR: '#CCCFD0',
  BACKGROUND_COLOR: '#353637',
  TEXT_COLOR: '#ffffff',
} as const;

// ============= Styled Components =============
const SearchInputContainer = styled.View`
  width: ${SEARCH_HEADER_CONFIG.INPUT_WIDTH_RATIO * 100}%;
  height: ${SEARCH_HEADER_CONFIG.INPUT_HEIGHT}px;
  background-color: ${SEARCH_HEADER_CONFIG.BACKGROUND_COLOR};
  flex-direction: row;
  margin-left: ${SEARCH_HEADER_CONFIG.INPUT_MARGIN_LEFT}px;
  align-items: center;
  justify-content: center;
  padding: 0px ${SEARCH_HEADER_CONFIG.PADDING_HORIZONTAL}px;
  border-radius: ${SEARCH_HEADER_CONFIG.BORDER_RADIUS}px;
`;

const SearchInput = styled.TextInput`
  background-color: ${SEARCH_HEADER_CONFIG.BACKGROUND_COLOR};
  height: ${SEARCH_HEADER_CONFIG.INPUT_HEIGHT}px;
  flex: 1;
  padding-left: ${SEARCH_HEADER_CONFIG.INPUT_PADDING_LEFT}px;
  color: ${SEARCH_HEADER_CONFIG.TEXT_COLOR};
  font-size: ${SEARCH_HEADER_CONFIG.INPUT_FONT_SIZE}px;
  font-family: PlusJakartaSans_400Regular;
`;