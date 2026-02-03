import { textStyle } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

type NoResultProps = {
  subText?: string;
};

const NoResult = ({ subText }: NoResultProps) => {
  return (
    <NoResultsContainer>
      <NoResultsText>Ooops...</NoResultsText>
      <NoResultsSubText>{subText || 'There is no Search Results.'}</NoResultsSubText>
    </NoResultsContainer>
  );
};

export default NoResult;

const NoResultsContainer = styled.View`
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`;

const NoResultsText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.Serif.H1_R)};
`;

const NoResultsSubText = styled.Text`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.gray.lightGray_1};
  ${({ theme }) => textStyle(theme.fonts.body.B4_R)};
`;
