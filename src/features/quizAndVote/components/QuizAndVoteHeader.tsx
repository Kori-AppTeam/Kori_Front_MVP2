import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import { SvgProps } from 'react-native-svg';
import styled from 'styled-components/native';

interface QuizAndVoteHeaderProps {
  title: string;
  subTitle?: string;
  Character?: React.ComponentType<SvgProps>;
}

const QuizAndVoteHeader = ({ title, subTitle, Character }: QuizAndVoteHeaderProps) => {
  return (
    <Container>
      <TextContainer>
        <Title>{title}</Title>
        {subTitle && <SubTitle>{subTitle}</SubTitle>}
      </TextContainer>
      {Character && (
        <CharacterContainer>
          <Character />
        </CharacterContainer>
      )}
    </Container>
  );
};

export default QuizAndVoteHeader;

const Container = styled.View`
  width: 100%;
  padding: 0 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 13px;
  height: 86px;
`;

const TextContainer = styled.View`
  flex: 1;
  align-items: center;
  gap: 8px;
`;

const Title = styled.Text`
  width: 100%;
  text-align: center;
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B1_SB)};
`;

const SubTitle = styled.Text`
  width: 100%;
  text-align: center;
  color: ${theme.colors.gray.lightGray_1};
  ${({ theme }) => textStyle(theme.fonts.body.B4_L)};
`;

const CharacterContainer = styled.View`
  width: 100px;
  height: 86px;
  align-items: center;
  justify-content: center;
`;
