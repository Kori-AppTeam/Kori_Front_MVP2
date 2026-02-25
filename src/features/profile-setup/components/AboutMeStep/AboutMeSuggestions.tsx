import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { useRandomIndices } from '@/src/features/profile-setup/hooks/useRandomIndices';
import { useProfileOptionsStore } from '@/src/features/profile-setup/store/useProfileOptions';

interface AboutMeSuggestionsProps {
  onPressSuggestion?: (suggestion: string) => void;
}

const AboutMeSuggestions = ({ onPressSuggestion }: AboutMeSuggestionsProps) => {
  const introductions = useProfileOptionsStore((s) => s.introductions);
  const count = Math.min(3, introductions.length);
  const { indices: selectedIndices, refresh: refreshSuggestions } = useRandomIndices(count, introductions.length);

  return (
    <Container>
      <SuggestionLabel>✨ ‘About Me’ Suggestions</SuggestionLabel>
      <SuggestionWrapper>
        {selectedIndices.map((index) => (
          <SuggestionText key={index} onPress={() => onPressSuggestion && onPressSuggestion(introductions[index])}>
            {introductions[index]}
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
