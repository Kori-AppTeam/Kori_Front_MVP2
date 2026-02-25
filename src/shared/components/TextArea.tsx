import React, { useMemo, useState } from 'react';
import styled from 'styled-components/native';
import type { TextInputProps } from 'react-native';
import { textStyle } from '@/src/styles/theme';

type Props = Omit<TextInputProps, 'multiline' | 'maxLength' | 'onChangeText'> & {
  limit: number;
  minHeight?: number;
  placeholder?: string;
  onChangeText?: (text: string) => void;
};

// TODO RHF 연동

const TextArea = ({ minHeight = 200, limit, onChangeText, ...props }: Props) => {
  const [uncontrolledText, setUncontrolledText] = useState<string>(
    typeof props.defaultValue === 'string' ? props.defaultValue : '',
  );

  const isControlled = typeof props.value === 'string';

  // 글자수 계산
  const currentText = useMemo(() => {
    if (isControlled) return props.value as string;
    return uncontrolledText;
  }, [isControlled, props.value, uncontrolledText]);

  const currentLength = currentText.length;

  //
  const handleChangeText = (text: string) => {
    if (!isControlled) setUncontrolledText(text);
    onChangeText?.(text);
  };

  return (
    <Container>
      <TextAreaInput
        {...props}
        minHeight={minHeight}
        multiline
        scrollEnabled
        maxLength={limit}
        onChangeText={handleChangeText}
      />
      <Counter>{`${currentLength}/${limit} limit`}</Counter>
    </Container>
  );
};

export default TextArea;

const Container = styled.View`
  position: relative;
  width: 100%;
`;

const TextAreaInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.gray.gray_1,
  textAlignVertical: 'top' as const,
}))<{ minHeight: number }>`
  width: 100%;
  min-height: ${({ minHeight }) => minHeight}px;
  padding: 16px;
  padding-bottom: 38px;

  ${({ theme }) => textStyle(theme.fonts.body.B3_R)};
  color: ${({ theme }) => theme.colors.primary.white};

  background-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  border-radius: 4px;
`;

const Counter = styled.Text`
  position: absolute;
  right: 16px;
  bottom: 16px;

  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
  color: ${({ theme }) => theme.colors.gray.gray_1};
`;
