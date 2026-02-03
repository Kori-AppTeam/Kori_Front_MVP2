import { formatDate } from '@/src/shared/utils/dateUtils';
import { QueryKey } from '@tanstack/react-query';
import React from 'react';
import { usePostPoll } from '../hooks/usePostPoll';
import { PollBaseType, TodayPollType } from '../types';
import { ClosedDateContainer, ClosedDateText } from './BaseOption';
import PollBox, { BoxContainer, OptionRow } from './PollBox';
import QuizOption from './QuizOption';

interface QuizBoxProps {
  pollId: number;
  data: TodayPollType | PollBaseType;
  queryKey?: QueryKey;
}

const QuizBox = ({ pollId, data, queryKey }: QuizBoxProps) => {
  const { mutate: postPoll } = usePostPoll(queryKey);
  const isExpired = new Date() > new Date(data.closeAt);
  const isSelectedOption = data.selectedOptionId;
  const showResult = data.selectedOptionId != null || isExpired;

  const handleSelectOption = (optionId: number) => {
    if (showResult) return; // 결과가 보여지는 상태에서는 선택 불가(퀴즈 참여 한 번만 가능)

    postPoll({
      pollId: pollId,
      optionId: optionId,
      pollType: 'QUIZ',
    });
  };

  return (
    <BoxContainer>
      <ClosedDateContainer>
        <ClosedDateText>Close&nbsp;:&nbsp;{formatDate(data.closeAt, true)}</ClosedDateText>
      </ClosedDateContainer>

      <PollBox title={data.title} subTitle={data.description} />

      <OptionRow>
        {data.options.map((option) => {
          const optionId = option.id ?? option.optionId;

          return (
            <QuizOption
              key={optionId}
              optionId={optionId}
              content={option.content}
              isSelected={isSelectedOption === optionId}
              isResult={showResult}
              onPress={() => handleSelectOption(optionId)}
              correctOptionId={showResult ? data.correctOptionId : null}
            />
          );
        })}
      </OptionRow>
    </BoxContainer>
  );
};

export default QuizBox;
