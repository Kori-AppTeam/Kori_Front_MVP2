import Icon from '@/components/common/Icon';
import HotKeywordChip from '@/src/shared/components/HotKeywordChip';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

type SuggestionHotKeywordProps = {
  data: string[];
  onPress?: (keyword: string) => void;
  onRefresh?: () => void;
};

const SuggestionHotKeyword = ({ data, onPress, onRefresh }: SuggestionHotKeywordProps) => {
  return (
    <Container>
      <Title>Search Suggestions</Title>

      <KeywordsContainer>
        {data.map((keyword, index) => (
          <HotKeywordChip key={index} value={keyword} onPress={() => onPress?.(keyword)} />
        ))}
        <RefreshButtonContainer onPress={() => onRefresh && onRefresh()}>
          <Icon type="refresh" size={20} color={theme.colors.primary.mint} />
          <RefreshButtonText>Refresh</RefreshButtonText>
        </RefreshButtonContainer>
      </KeywordsContainer>
    </Container>
  );
};

export default SuggestionHotKeyword;

const Container = styled.View`
  padding: 10px 20px;
  gap: 24px;
`;

const Title = styled.Text`
  width: 100%;
  text-align: left;
  color: ${theme.colors.gray.gray_1};
  ${({ theme }) => textStyle(theme.fonts.body.B5_SB)};
`;

const KeywordsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const RefreshButtonContainer = styled.Pressable`
  border-radius: 100px;
  background-color: transparent;
  border: 1px solid ${theme.colors.primary.mint};
  gap: 4px;
  padding: 9px 11px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  max-height: 44px;
  align-self: flex-start;
`;

const RefreshButtonText = styled.Text`
  color: ${theme.colors.primary.mint};
`;
