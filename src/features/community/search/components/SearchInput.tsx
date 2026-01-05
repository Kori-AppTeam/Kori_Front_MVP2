import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onSubmitEditing?: () => void;
};

const SearchInput = ({ value, onChangeText, placeholder, onSubmitEditing }: SearchInputProps) => {
  return (
    <Container>
      <IconBtn onPress={() => router.back()}>
        <Icon type="previous" size={24} color={theme.colors.gray.lightGray_1} />
      </IconBtn>

      <InputContainer>
        <Icon type="search" size={24} color={theme.colors.gray.lightGray_1} />
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray.darkGray_2}
          returnKeyType="search"
          onSubmitEditing={onSubmitEditing}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
        />
        {value.length > 0 && (
          <IconBtn onPress={() => onChangeText('')}>
            <Icon type="cancel" size={20} color={theme.colors.gray.gray_2} />
          </IconBtn>
        )}
      </InputContainer>
    </Container>
  );
};

export default SearchInput;

const Container = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
`;
const IconBtn = styled.Pressable`
  padding: 2px;
  align-items: center;
  justify-content: center;
`;
const InputContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.gray.darkGray_1};
  border-radius: 4px;
  padding: 0 12px;
  height: 44px;
  gap: 6px;
`;
const Input = styled.TextInput`
  flex: 1;
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B2_R)};
`;
