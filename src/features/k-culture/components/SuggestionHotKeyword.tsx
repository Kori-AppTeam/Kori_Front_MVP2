import HotKeywordChip from '@/src/shared/components/HotKeywordChip';
import RefreshButton from '@/src/shared/components/RefreshButton';
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
        <RefreshButton onPress={onRefresh} />
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
