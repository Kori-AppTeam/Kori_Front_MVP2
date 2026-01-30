import AutoSuggestionList from '@/src/shared/components/AutoSuggestionList';
import React from 'react';
import { useGetNewsAutoSuggestions, usePostClickedNewsSuggestion } from '../hooks/useNewsAutoSuggestions';

type KNewsAutoCompleteProps = {
  value: string;
  onSubmitEditing: (suggestion: string) => void;
};

const KNewsAutoComplete = ({ value, onSubmitEditing }: KNewsAutoCompleteProps) => {
  const { data: autoSuggestions } = useGetNewsAutoSuggestions(value);
  const { mutate: postClickedNewsSuggestion } = usePostClickedNewsSuggestion();

  const handlePressItem = (suggestion: string) => {
    postClickedNewsSuggestion(suggestion);
    onSubmitEditing(suggestion);
  };

  return <AutoSuggestionList suggestions={autoSuggestions} onPressItem={handlePressItem} />;
};

export default KNewsAutoComplete;
