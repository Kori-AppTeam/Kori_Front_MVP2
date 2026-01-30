import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

type AutoSuggestionListProps = {
  suggestions: string[] | undefined;
  onPressItem: (suggestion: string) => void;
};

const AutoSuggestionList = ({ suggestions, onPressItem }: AutoSuggestionListProps) => {
  // 자동완성 결과가 없으면 아무것도 렌더링하지 않음
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <Container>
      {suggestions?.map((suggestion, index) => (
        <SuggestionItem key={`${index}-${suggestion}`} onPress={() => onPressItem(suggestion)}>
          <Icon type="search" size={20} color={theme.colors.gray.lightGray_1} />
          <SuggestionText>{suggestion}</SuggestionText>
        </SuggestionItem>
      ))}
    </Container>
  );
};

export default AutoSuggestionList;

const Container = styled.View`
  flex: 1;
  padding: 0 20px;
`;

const SuggestionItem = styled.Pressable`
  width: 100%;
  padding: 14px 0;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
`;

const SuggestionText = styled.Text`
  flex: 1;
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B4_L)};
`;
