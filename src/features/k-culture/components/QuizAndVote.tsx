import api from '@/api/axiosInstance';
import QuizCharacter from '@/assets/images/character_quiz.svg';
import VoteCharacter from '@/assets/images/character_vote.svg';
import { textStyle, theme } from '@/src/styles/theme';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { useGetQuizAndVote } from '../hooks/useGetQuizAndVote';
import { QuizAndVoteItem } from '../types';
import QuizAndVoteHeader from './QuizAndVoteHeader';
import QuizBox from './QuizBox';

// 더미 데이터
const DUMMY_QUIZ_DATA: QuizAndVoteItem = {
  id: 11111,
  type: 'QUIZ',
  title: '이 한국어 단어의 의미는?',
  description: '다음 한국어 단어 "고마워"의 올바른 의미를 선택하세요',
  closeAt: '2026-01-15T23:59:59.000Z',
  totalVoteCount: 1523,
  options: [
    {
      id: 101,
      content: 'Thank you',
      voteCount: 1204,
    },
    {
      id: 102,
      content: 'Sorry',
      voteCount: 89,
    },
    {
      id: 103,
      content: 'Hello',
      voteCount: 156,
    },
    {
      id: 104,
      content: 'Goodbye',
      voteCount: 74,
    },
  ],
  selectedOptionId: 101,
};

const DUMMY_VOTE_DATA: QuizAndVoteItem = {
  id: 22222,
  type: 'VOTE',
  title: '가장 좋아하는 한국 음식은?',
  description: '한국의 대표 음식 중 여러분이 가장 좋아하는 음식을 선택해주세요!',
  closeAt: '2026-01-15T23:59:59.000Z',
  totalVoteCount: 2847,
  options: [
    {
      id: 1001,
      content: '김치찌개',
      voteCount: 892,
    },
    {
      id: 1002,
      content: '비빔밥',
      voteCount: 756,
    },
    {
      id: 1003,
      content: '삼겹살',
      voteCount: 1024,
    },
    {
      id: 1004,
      content: '떡볶이',
      voteCount: 175,
    },
  ],
  selectedOptionId: 1003,
};

const QuizAndVote = () => {
  const [tab, setTab] = useState<'QUIZ' | 'VOTE'>('QUIZ');
  const { data, isError, isLoading } = useGetQuizAndVote(tab);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/v1/boards/categories');
        console.log('===== /api/v1/boards/categories 응답 =====');
        console.log(JSON.stringify(response.data, null, 2));
        console.log('=========================================');
      } catch (error) {
        console.error('카테고리 API 호출 에러:', error);
      }
    };

    fetchCategories();
  }, []);

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
      <QuizBox data={DUMMY_QUIZ_DATA} />
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
