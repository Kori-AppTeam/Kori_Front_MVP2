import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

const QuizAndVote = () => {
  return (
    <Container>
      <Title>Quiz&Vote</Title>
    </Container>
  );
};

export default QuizAndVote;

const Container = styled.View`
  padding: 30px 20px;
  background-color: ${theme.colors.primary.black};
  align-items: center;
  gap: 24px;
`;

const Title = styled.Text`
  width: 100%;
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.headline.H4_SB)};
`;
