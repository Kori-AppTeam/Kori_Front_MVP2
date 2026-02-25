import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef } from 'react';
import { Keyboard, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface SearchInputProps {
  placeholder: string;
  search: string;
  setSearch: (text: string) => void;
  handleClearSearch: () => void;
}

const SearchInput = ({ placeholder, search, setSearch, handleClearSearch }: SearchInputProps) => {
  const inputRef = useRef<React.ElementRef<typeof BottomSheetTextInput>>(null);

  const focusInput = useCallback(() => {
    // Android에서 바텀시트 제스처/터치 중재로 인해
    // TextInput이 즉시 focus되지 않는 케이스가 있어 press-in 시 강제 focus
    inputRef.current?.focus();
  }, []);

  return (
    <SearchContainer onPressIn={focusInput}>
      <Icon size={24} type="search" />
      <Input
        ref={inputRef}
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

const SearchContainer = styled.Pressable`
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
