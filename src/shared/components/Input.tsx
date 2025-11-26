import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components/native';

export interface InputProps {
  label?: string;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  validated?: 'accept' | 'error';
  secureTextEntry?: boolean;
  registerField?: string;
}

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  validated,
  secureTextEntry = false,
  registerField,
}: InputProps) => {
  const method = useFormContext();
  const isValid = validated === 'accept';

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <InputWrapper>
        {registerField && method?.control ? (
          <Controller
            control={method.control}
            name={registerField}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputBox
                onChangeText={onChange}
                onBlur={onBlur}
                value={value ?? ''}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
              />
            )}
          />
        ) : (
          <InputBox
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            isError={validated === 'error'}
            secureTextEntry={secureTextEntry}
          />
        )}
        {validated && (
          <Icon
            size={24}
            type={isValid ? 'check' : 'cancel'}
            color={isValid ? theme.colors.primary.mint : theme.colors.secondary.red}
          />
        )}
      </InputWrapper>
    </Container>
  );
};

export default Input;

const Container = styled.View`
  width: 100%;
  height: auto;
`;

const Label = styled.Text`
  margin-bottom: 8px;

  ${({ theme }) => textStyle(theme.fonts.body.B5_SB)};
  color: ${({ theme }) => theme.colors.gray.gray_1};
`;

const InputBox = styled.TextInput.attrs<{
  isError?: boolean;
  secureTextEntry?: boolean;
}>(({ secureTextEntry }) => ({
  secureTextEntry,
  selectionColor: theme.colors.primary.mint,
  placeholderTextColor: theme.colors.gray.darkGray_2,
}))`
  flex: 1;

  ${({ theme }) => textStyle(theme.fonts.body.B3_R)};
  color: ${({ theme, isError }) => (isError ? theme.colors.secondary.red : theme.colors.primary.white)};
  background-color: ${({ theme }) => theme.colors.gray.darkGray_1};
`;

const InputWrapper = styled.View`
  width: 100%;
  height: 50px;
  border-radius: 4px;

  background-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  padding-left: 16px;
  padding-right: 12px;

  flex-direction: row;
  align-items: center;
`;
