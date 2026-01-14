import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components/native';

const DUMMY_SUGGESTION_LIST = [
  'Hi! Open to conversations 😊',
  'Hello! Let’s talk and connect.',
  'Hey! Nice to meet you 👋',
  'Tech nerd curious about apps.',
  'Animal lover who volunteers at local shelters.',
] as const;

const pickRandomIndices = (count: number, max: number) => {
  const safeCount = Math.min(count, max);
  const indices = new Set<number>();

  while (indices.size < safeCount) {
    indices.add(Math.floor(Math.random() * max));
  }

  return [...indices];
};

interface AboutMeSuggestionsProps {
  onPressSuggestion?: (suggestion: string) => void;
}

const AboutMeSuggestions = ({ onPressSuggestion }: AboutMeSuggestionsProps) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>(() =>
    pickRandomIndices(3, DUMMY_SUGGESTION_LIST.length),
  );

  const refreshSuggestions = useCallback(() => {
    setSelectedIndices(pickRandomIndices(3, DUMMY_SUGGESTION_LIST.length));
  }, []);

  return (
    <Container>
      <SuggestionLabel>✨ ‘About Me’ Suggestions</SuggestionLabel>
      <SuggestionWrapper>
        {selectedIndices.map((index) => (
          <SuggestionText
            key={index}
            onPress={() => onPressSuggestion && onPressSuggestion(DUMMY_SUGGESTION_LIST[index])}
          >
            {DUMMY_SUGGESTION_LIST[index]}
          </SuggestionText>
        ))}
      </SuggestionWrapper>
      <RefreshButton onPress={refreshSuggestions}>
        <Icon type="refresh" color={theme.colors.primary.mint} size={20} />
        <RefreshButtonText>Refresh</RefreshButtonText>
      </RefreshButton>
    </Container>
  );
};

export default AboutMeSuggestions;

const Container = styled.ScrollView``;

const SuggestionLabel = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B4_SB)};
  color: ${({ theme }) => theme.colors.primary.white};
  margin-bottom: 12px;
`;

const SuggestionWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const SuggestionText = styled.Text`
  padding: 8px 12px;
  border-radius: 4px;
  ${({ theme }) => textStyle(theme.fonts.body.B3_R)};
  color: ${({ theme }) => theme.colors.primary.white};
  background-color: ${({ theme }) => theme.colors.gray.darkGray_1};
`;

const RefreshButton = styled.TouchableOpacity`
  align-self: flex-start;
  border-radius: 999px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.primary.mint};
  padding: 8px 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  gap: 4px;
`;

const RefreshButtonText = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B3_R)};
  color: ${({ theme }) => theme.colors.primary.mint};
`;
