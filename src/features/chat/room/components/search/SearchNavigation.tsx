// src/features/chat/room/components/search/SearchNavigation.tsx
import React from 'react';
import styled from 'styled-components/native';
import { useSearchStore } from '../../stores/useSearchStore';
import { SearchNavigationProps } from '../../types';

const SearchNavigation: React.FC<SearchNavigationProps> = ({ onNavigateUp, onNavigateDown }) => {
  const { isSearching, getSearchResultText } = useSearchStore();
  const searchResultText = getSearchResultText();

  return (
    <NavigationContainer>
      <NavigationButton disabled={isSearching} onPress={onNavigateUp}>
        <ArrowImage
          source={require('@/assets/images/UpArrow.png')}
          style={NAVIGATION_CONFIG.UP_ARROW_STYLE}
          resizeMode="contain"
        />
      </NavigationButton>

      <NavigationButton disabled={isSearching} onPress={onNavigateDown}>
        <ArrowImage
          source={require('@/assets/images/DownArrow.png')}
          style={NAVIGATION_CONFIG.DOWN_ARROW_STYLE}
          resizeMode="contain"
        />
      </NavigationButton>

      {!isSearching && searchResultText && <ResultText>{searchResultText}</ResultText>}
    </NavigationContainer>
  );
};

export default SearchNavigation;

// ============= Constants =============
const NAVIGATION_CONFIG = {
  HEIGHT: 45,
  ARROW_SIZE: 17,
  UP_ARROW_MARGIN_LEFT: 10,
  DOWN_ARROW_MARGIN_LEFT: 18,
  RESULT_TEXT_LEFT: '50%',
  RESULT_FONT_SIZE: 14,
  BACKGROUND_COLOR: '#1d1e1f',
  BORDER_COLOR: '#353637',
  TEXT_COLOR: '#ffffff',
  UP_ARROW_STYLE: {
    width: 17,
    height: 17,
    marginLeft: 10,
  },
  DOWN_ARROW_STYLE: {
    width: 17,
    height: 17,
    marginLeft: 18,
  },
} as const;

// ============= Base Styled Components =============
const BaseContainer = styled.View`
  background-color: ${NAVIGATION_CONFIG.BACKGROUND_COLOR};
  border-top-width: 1px;
  border-top-color: ${NAVIGATION_CONFIG.BORDER_COLOR};
  flex-direction: row;
  align-items: center;
`;

const BaseButton = styled.TouchableOpacity<{ disabled: boolean }>`
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

// ============= Styled Components =============
const NavigationContainer = styled(BaseContainer)`
  height: ${NAVIGATION_CONFIG.HEIGHT}px;
`;

const NavigationButton = styled(BaseButton)`
  padding: 5px;
`;

const ArrowImage = styled.Image``;

const ResultText = styled.Text`
  position: absolute;
  left: ${NAVIGATION_CONFIG.RESULT_TEXT_LEFT};
  color: ${NAVIGATION_CONFIG.TEXT_COLOR};
  font-size: ${NAVIGATION_CONFIG.RESULT_FONT_SIZE}px;
  font-family: PlusJakartaSans_300Light;
`;
