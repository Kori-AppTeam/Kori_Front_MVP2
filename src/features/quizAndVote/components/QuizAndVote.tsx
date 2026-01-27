import QuizCharacter from '@/assets/images/character_quiz.svg';
import VoteCharacter from '@/assets/images/character_vote.svg';
import { textStyle, theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import MoreButton from '../../k-culture/components/MoreButton';
import { useGetTodayPoll } from '../hooks/useGetTodayPoll';
import QuizAndVoteHeader from './QuizAndVoteHeader';
import QuizBox from './QuizBox';
import VoteBox from './VoteBox';

const QuizAndVote = () => {
  const [tab, setTab] = useState<'QUIZ' | 'VOTE'>('QUIZ');
  const { data, isError, isLoading } = useGetTodayPoll(tab);

  const handleMorePress = () => {
    const targetCategory = tab === 'QUIZ' ? 'QUIZ' : 'VOTE';
    router.push(`/(tabs)/community?category=${targetCategory}`);
  };

  return (
    <Container>
      {/* 탭 */}
      <Title>Quiz&nbsp;&&nbsp;Vote</Title>
      <TabRow>
        <TabButton isActive={tab === 'QUIZ'} onPress={() => setTab('QUIZ')}>
          <TabButtonText isActive={tab === 'QUIZ'}>Quiz</TabButtonText>
        </TabButton>
        <TabButton isActive={tab === 'VOTE'} onPress={() => setTab('VOTE')}>
          <TabButtonText isActive={tab === 'VOTE'}>Vote</TabButtonText>
        </TabButton>
      </TabRow>

      <PollContainer>
        {/* 퀴즈 or 투표 */}
        {isLoading ? (
          <LoadingContainer>
            <ActivityIndicator />
          </LoadingContainer>
        ) : isError ? (
          <ErrorMessage>Failed to load poll data</ErrorMessage>
        ) : !data ? (
          <EmptyMessage>No Poll available</EmptyMessage>
        ) : (
          <>
            {tab === 'QUIZ' ? (
              <>
                <QuizAndVoteHeader title="Today's Quiz" subTitle="Take today's Korean quiz" Character={QuizCharacter} />
                <QuizBox pollId={data.id} data={data} />
              </>
            ) : (
              <>
                <QuizAndVoteHeader
                  title="Today's Vote"
                  subTitle="Take Korean favorites poll"
                  Character={VoteCharacter}
                />
                <VoteBox pollId={data.id} data={data} />
              </>
            )}
          </>
        )}
      </PollContainer>
      <MoreButton buttonText={tab === 'QUIZ' ? 'More Quiz' : 'More Vote'} onPress={handleMorePress} />
    </Container>
  );
};

export default QuizAndVote;

const Container = styled.View`
  padding: 30px 0;
  background-color: ${theme.colors.primary.black};
  align-items: center;
`;

const Title = styled.Text`
  width: 100%;
  padding: 0 20px;
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.headline.H4_SB)};
  margin-bottom: 20px;
`;

const TabRow = styled.View`
  flex-direction: row;
  gap: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  margin-bottom: 10px;
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

const EmptyMessage = styled.Text`
  color: ${({ theme }) => theme.colors.gray.darkGray_2};
  ${({ theme }) => textStyle(theme.fonts.body.B4_M)};
  text-align: center;
  padding: 20px;
`;

const ErrorMessage = styled.Text`
  color: ${({ theme }) => theme.colors.secondary.red};
  ${({ theme }) => textStyle(theme.fonts.body.B4_M)};
  text-align: center;
  padding: 20px;
`;

const LoadingContainer = styled.View`
  padding: 50px 0;
  justify-content: center;
  align-items: center;
`;

const PollContainer = styled.View`
  padding: 0 20px;
  width: 100%;
  align-items: center;
  margin-bottom: 24px;
  min-height: 200px;
  justify-content: center;
  flex: none;
`;
