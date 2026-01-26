import { formatDate } from '@/src/shared/utils/dateUtils';
import { textStyle } from '@/src/styles/theme';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { usePostPoll } from '../hooks/usePostPoll';
import { TodayPollType } from '../types';
import PollBox, { BoxContainer, OptionRow } from './PollBox';
import QuizOption from './QuizOption';

const QuizBox = ({ data }: { data: TodayPollType }) => {
  const [isSelectedOption, setIsSelectedOption] = useState<number | null>(data.selectedOptionId ?? null);
  const [showResult, setShowResult] = useState(!!data.selectedOptionId); // 이미 선택한 옵션이 있으면 결과 보여주기

  const { mutate: postPoll, data: pollResult } = usePostPoll();

  const answerOptionId = pollResult?.correctOptionId ?? data.correctOptionId;

  const handleSelectOption = (optionId: number) => {
    if (showResult) return; // 결과가 보여지는 상태에서는 선택 불가(퀴즈 참여 한 번만 가능)

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
      <ClosedDateContainer>
        <ClosedDateText>Close&nbsp;:&nbsp;{formatDate(data.closeAt, true)}</ClosedDateText>
      </ClosedDateContainer>

      <PollBox title={data.title} subTitle={data.description} />

      <OptionRow>
        {data.options.map((option) => (
          <QuizOption
            key={option.id}
            optionId={option.id}
            content={option.content}
            isSelected={isSelectedOption === option.id}
            isResult={showResult}
            onPress={() => handleSelectOption(option.id)}
            correctOptionId={showResult ? answerOptionId : null}
          />
        ))}
      </OptionRow>
    </BoxContainer>
  );
};

export default QuizBox;

const ClosedDateContainer = styled.View`
  align-self: flex-start;
  justify-content: center;
  background-color: #1a4634;
  padding: 6px;
  border-radius: 4px;
  margin-bottom: 24px;
`;

const ClosedDateText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.mint};
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
`;
