import QuizCharacter from '@/assets/images/character_quiz.svg';
import VoteCharacter from '@/assets/images/character_vote.svg';
import { textStyle, theme } from '@/src/styles/theme';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { useGetQuizAndVote } from '../hooks/useGetQuizAndVote';
import QuizAndVoteHeader from './QuizAndVoteHeader';
import QuizBox from './QuizBox';

const QuizAndVote = () => {
  const [tab, setTab] = useState<'QUIZ' | 'VOTE'>('QUIZ');
  const { data, isError, isLoading } = useGetQuizAndVote(tab);

  if (isLoading) {
    return <Container />;
  }

  if (isError || !data) {
    return <Container />;
  }

  return (
    <Container>
      {/* 탭 */}
      <Title>Quiz&Vote</Title>
      <TabRow>
        <TabButton isActive={tab === 'QUIZ'} onPress={() => setTab('QUIZ')}>
          <TabButtonText isActive={tab === 'QUIZ'}>Quiz</TabButtonText>
        </TabButton>
        <TabButton isActive={tab === 'VOTE'} onPress={() => setTab('VOTE')}>
          <TabButtonText isActive={tab === 'VOTE'}>Vote</TabButtonText>
        </TabButton>
      </TabRow>

      {/* 헤더 */}
      {tab === 'QUIZ' ? (
        <QuizAndVoteHeader title="Today's Quiz" subTitle="Take today's Korean quiz" Character={QuizCharacter} />
      ) : (
        <QuizAndVoteHeader title="Today's Vote" subTitle="Take Korean favorites poll" Character={VoteCharacter} />
      )}

      {/* 퀴즈 or 투표 */}
      <QuizBox data={data} />
    </Container>
  );
};

export default QuizAndVote;

const Container = styled.View`
  padding: 30px 0;
  background-color: ${theme.colors.primary.black};
  align-items: center;
  gap: 24px;
`;

const Title = styled.Text`
  width: 100%;
  padding: 0 20px;
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.headline.H4_SB)};
`;

const TabRow = styled.View`
  flex-direction: row;
  gap: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.gray.darkGray_1};
`;

const TabButton = styled.Pressable<{ isActive: boolean }>`
  flex: 1;
  margin: 0 20px;
  padding: 12px 0;
  border-bottom-width: 2px;
  border-color: ${({ isActive, theme }) => (isActive ? theme.colors.primary.mint : 'transparent')};
  align-items: center;
`;

const TabButtonText = styled.Text<{ isActive: boolean }>`
  color: ${({ isActive, theme }) => (isActive ? theme.colors.primary.mint : theme.colors.gray.darkGray_2)};
  ${({ isActive, theme }) => (isActive ? textStyle(theme.fonts.body.B4_SB) : textStyle(theme.fonts.body.B4_M))};
`;
