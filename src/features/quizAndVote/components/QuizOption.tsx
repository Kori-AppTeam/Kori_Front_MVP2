import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

const QuizOption = ({ option }: { option: string }) => {
  return (
    <Container>
      <OptionText>{option}</OptionText>
      <Checkbox />
    </Container>
  );
};

export default QuizOption;

const Container = styled.Pressable`
  width: 100%;
  background-color: ${theme.colors.gray.darkGray_2};
  color: ${theme.colors.primary.white};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-radius: 8px;
`;

const OptionText = styled.Text`
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
`;

const Checkbox = styled.View`
  width: 18px;
  height: 18px;
  border-radius: 100px;
  border-width: 1px;
  border-color: ${theme.colors.gray.gray_2};
`;
