import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React from 'react';
import { Keyboard, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface SearchInputProps {
  placeholder: string;
  search: string;
  setSearch: (text: string) => void;
  handleClearSearch: () => void;
}

const SearchInput = ({ placeholder, search, setSearch, handleClearSearch }: SearchInputProps) => {
  return (
    <SearchContainer>
      <Icon size={24} type="search" />
      <Input
        placeholder={placeholder}
        value={search}
        placeholderTextColor={theme.colors.gray.gray_2}
        onChangeText={setSearch}
        returnKeyType="done"
        blurOnSubmit
        onSubmitEditing={() => Keyboard.dismiss()}
      />

      <SearchButtonsWrapper>
        <TouchableOpacity onPress={handleClearSearch} disabled={!search}>
          <Icon size={20} type="cancel" />
        </TouchableOpacity>
      </SearchButtonsWrapper>
    </SearchContainer>
  );
};

export default SearchInput;

const SearchContainer = styled.View`
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: row;
  border-radius: 30px;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.gray.gray_2};
`;

const Input = styled(BottomSheetTextInput)`
  flex: 1;
  margin: 0 0 2px 10px;
  color: ${({ theme }) => theme.colors.gray.lightGray_2};
  ${({ theme }) => textStyle(theme.fonts.body.B2_R)};
`;

const SearchButtonsWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
