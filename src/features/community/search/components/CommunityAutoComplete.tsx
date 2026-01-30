import AutoSuggestionList from '@/src/shared/components/AutoSuggestionList';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { AllowedCategory } from '../../post/types';
import { CATEGORY_TO_BOARD_ID } from '../../shared/constants/constants';
import { useGetAutoSuggestions, usePostClickedKeyword } from '../hooks/useAutoSuggestions';

type AutoCompleteProps = {
  category: AllowedCategory;
  value: string;
  onSubmitEditing: (suggestion: string) => void;
};

const CommunityAutoComplete = ({ category, value, onSubmitEditing }: AutoCompleteProps) => {
  const { data: autoSuggestions } = useGetAutoSuggestions(CATEGORY_TO_BOARD_ID[category], value);
  const { mutate: postClickedKeyword } = usePostClickedKeyword();

  const handlePressItem = (suggestion: string) => {
    onSubmitEditing(suggestion);
    postClickedKeyword(suggestion);
  };

  return <AutoSuggestionList suggestions={autoSuggestions} onPressItem={handlePressItem} />;
};

export default CommunityAutoComplete;

const Container = styled.View`
  flex: 1;
  margin-top: 10px;
  padding: 0 20px;
`;

const SuggestionItem = styled.Pressable`
  width: 100%;
  padding: 10px 0;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
`;

const SuggestionText = styled.Text`
  flex: 1;
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B4_L)};
`;
