import QuizBox from '@/src/features/quizAndVote/components/QuizBox';
import VoteBox from '@/src/features/quizAndVote/components/VoteBox';
import { PollBaseType } from '@/src/features/quizAndVote/types';
import { QueryKey } from '@tanstack/react-query';
import React from 'react';
import styled from 'styled-components/native';

interface PostPollProps {
  type: 'QUIZ' | 'VOTE';
  pollInfo?: PollBaseType;
  pollId?: number;
  queryKey?: QueryKey;
}

const PostPoll = ({ type, pollInfo, pollId, queryKey }: PostPollProps) => {
  if (!pollId || !pollInfo) {
    return null;
  }

  return (
    <PollContainer>
      {type === 'QUIZ' && <QuizBox pollId={pollId} data={pollInfo} queryKey={queryKey} />}
      {type === 'VOTE' && <VoteBox pollId={pollId} data={pollInfo} queryKey={queryKey} />}
    </PollContainer>
  );
};

export default PostPoll;

const PollContainer = styled.View`
  width: 100%;
  padding: 0 20px;
`;
