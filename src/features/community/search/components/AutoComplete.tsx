import React from 'react';
import { View } from 'react-native';
import { AllowedCategory } from '../../post/types';
import { CATEGORY_TO_BOARD_ID } from '../../shared/constants/constants';
import { useGetAutoSuggestions } from '../hooks/useGetAutoSuggestions';

type AutoCompleteProps = {
  category: AllowedCategory;
  value: string;
};

const AutoComplete = ({ category, value }: AutoCompleteProps) => {
  const { data: autoSuggestions } = useGetAutoSuggestions(CATEGORY_TO_BOARD_ID[category], value);

  return <View></View>;
};

export default AutoComplete;
