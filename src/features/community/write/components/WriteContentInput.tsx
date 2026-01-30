import { textStyle, theme } from '@/src/styles/theme';
import React, { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import styled from 'styled-components/native';

const WriteContentInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
  return (
    <StyledInput
      ref={ref}
      multiline
      scrollEnabled={false}
      textAlignVertical="top"
      placeholderTextColor={theme.colors.gray.gray_1}
      returnKeyType="default"
      {...props}
    />
  );
});

export default WriteContentInput;

const StyledInput = styled(TextInput)`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B3_L)};
  padding: 0;
`;

WriteContentInput.displayName = 'WriteContentInput';
