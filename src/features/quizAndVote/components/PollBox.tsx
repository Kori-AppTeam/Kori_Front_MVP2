import { textStyle } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

type PollBoxProps = {
  title: string;
  subTitle?: string;
};

const PollBox = ({ title, subTitle }: PollBoxProps) => {
  return (
    <TitleRow>
      <Title>Q. {title}</Title>
      {subTitle && <SubTitle>{subTitle}</SubTitle>}
    </TitleRow>
  );
};

export default PollBox;

export const BoxContainer = styled.View`
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  border-radius: 10px;
`;

export const TitleRow = styled.View`
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
`;

export const Title = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B2_SB)};
  color: ${({ theme }) => theme.colors.primary.white};
`;

export const SubTitle = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B4_L)};
  color: ${({ theme }) => theme.colors.primary.white};
`;

export const OptionRow = styled.View`
  width: 100%;
  gap: 10px;
`;
