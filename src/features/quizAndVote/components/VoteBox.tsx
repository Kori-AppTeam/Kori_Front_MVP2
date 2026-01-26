import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { usePostPoll } from '../hooks/usePostPoll';
import { PollBaseType, TodayPollType } from '../types';
import { calculateVoteRatio } from '../utils/calculateVoteRatio';
import PollBox, { BoxContainer, OptionRow } from './PollBox';
import VoteOption from './VoteOption';

const VoteBox = ({ data }: { data: TodayPollType | PollBaseType }) => {
  const { mutate: postPoll } = usePostPoll();

  const showResult = !!data.selectedOptionId;

  const handleSelectOption = (optionId: number) => {
    if (showResult) return; // 결과가 보여지는 상태에서는 선택 불가(투표 참여 한 번만 가능)

    postPoll({
      pollId: data.id,
      optionId: optionId,
      pollType: 'VOTE',
    });
  };

  return (
    <BoxContainer>
      <PollBox title={data.title} subTitle={data.description} />

      <OptionRow>
        {data.options.map((option) => (
          <VoteOption
            key={option.id}
            optionId={option.id}
            content={option.content}
            isSelected={data.selectedOptionId === option.id}
            isResult={showResult}
            onPress={() => !data.selectedOptionId && handleSelectOption(option.id)}
            votePercentage={showResult ? calculateVoteRatio(data.totalVoteCount, option.voteCount) : 0}
          />
        ))}
      </OptionRow>

      <VoteCountRow>
        <VoteCountText color={theme.colors.primary.mint}>{data.totalVoteCount}</VoteCountText>
        <VoteCountText>votes</VoteCountText>
      </VoteCountRow>
    </BoxContainer>
  );
};

export default VoteBox;

const VoteCountRow = styled.View`
  margin-top: 24px;
  flex-direction: row;
  gap: 4px;
`;

const VoteCountText = styled.Text<{ color?: string }>`
  color: ${({ color, theme }) => color || theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
`;
