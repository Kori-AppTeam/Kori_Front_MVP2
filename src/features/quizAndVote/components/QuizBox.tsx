import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { QuizAndVoteItem } from '../../k-culture/types';

const QuizBox = ({ data }: { data: QuizAndVoteItem }) => {
  return (
    <Container>
      <Title>{data.title}</Title>
      <Description>{data.description}</Description>
    </Container>
  );
};

export default QuizBox;

const Container = styled.View`
  padding: 20px;
  background-color: ${theme.colors.gray.darkBlack_1};
  border-radius: 10px;
`;

const Title = styled.Text`
  width: 100%;
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B2_SB)};
`;

const Description = styled.Text`
  width: 100%;
  margin-top: 16px;
  color: ${theme.colors.gray.lightGray_2};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
`;
