import { textStyle, theme } from '@/src/styles/theme';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { usePostPoll } from '../hooks/usePostPoll';
import { TodayPollType } from '../types';
import { calculateVoteRatio } from '../utils/calculateVoteRatio';
import PollBox, { BoxContainer, OptionRow } from './PollBox';
import VoteOption from './VoteOption';

const VoteBox = ({ data }: { data: TodayPollType }) => {
  const [isSelectedOption, setIsSelectedOption] = useState<number | null>(data.selectedOptionId ?? null);
  const [showResult, setShowResult] = useState(data.selectedOptionId ? true : false);

  const { mutate: postPoll, data: pollResult } = usePostPoll();

  const handleSelectOption = (optionId: number) => {
    if (showResult) return; // 결과가 보여지는 상태에서는 선택 불가(투표 참여 한 번만 가능)

    setIsSelectedOption(optionId);
    postPoll(
      { pollId: data.id, optionId: optionId },
      {
        onSuccess: () => {
          setShowResult(true);
        },
      },
    );
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
            isSelected={isSelectedOption === option.id}
            isResult={showResult}
            onPress={() => !isSelectedOption && handleSelectOption(option.id)}
            votePercentage={
              showResult && pollResult
                ? pollResult.results.find((r) => r.optionId === option.id)?.percentage
                : calculateVoteRatio(data.totalVoteCount, option.voteCount)
            }
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
