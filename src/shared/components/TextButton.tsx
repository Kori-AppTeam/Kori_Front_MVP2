import { textStyle } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

interface TextButtonProps {
  label: string;
  onPress?: () => void;
}

const TextButton = ({ label, onPress }: TextButtonProps) => {
  return (
    <Btn onPress={onPress}>
      <BtnText>{label}</BtnText>
    </Btn>
  );
};

export default TextButton;

const Btn = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  height: 20px;
`;

const BtnText = styled.Text`
  color: ${({ theme }) => theme.colors.gray.lightGray_1};
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
  text-decoration-line: underline;
`;
