import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import React from 'react';
import { BaseOptionComponent, SelectCircle } from './BaseOption';

interface QuizOptionProps {
  optionId: number;
  content: string;
  correctOptionId?: number | null;
  isSelected?: boolean;
  isResult?: boolean;
  onPress?: () => void;
}

const QuizOption = ({ optionId, content, isSelected, isResult, onPress, correctOptionId }: QuizOptionProps) => {
  const isAnswer = correctOptionId === optionId; // 정답 여부
  const isMyChoice = isSelected; // 내가 선택한 옵션인지 여부

  // 옵션 스타일 결정
  const styleProps = () => {
    // 결과가 보여지는 상태일 때(선택한 값과 정답 비교 - 정답이면 초록색, 오답이면 빨간색, 나머지는 회색)
    if (isResult) {
      // 정답인 경우
      if (isAnswer) {
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary.mint,
          textColor: theme.colors.primary.mint,
        };
      }
      // 오답인 경우
      if (isMyChoice && !isAnswer) {
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.secondary.red,
          textColor: theme.colors.secondary.red,
        };
      }
      // 내가 선택하지 않은 나머지 옵션들
      return {
        backgroundColor: 'transparent',
        borderColor: theme.colors.gray.darkGray_2,
        textColor: theme.colors.gray.gray_1,
      };
    }

    // 정답 표시 전 상태
    return {
      backgroundColor: theme.colors.gray.darkGray_2,
      borderColor: 'transparent',
      textColor: theme.colors.primary.white,
    };
  };

  // 옵션 우측 컨텐츠 결정
  const rightContent = () => {
    // 결과가 보여지는 상태일 때
    if (isResult) {
      // 정답인 경우
      if (isAnswer) {
        return <Icon type="check" size={24} color={theme.colors.primary.mint} />;
      }
      // 오답인 경우
      if (isMyChoice && !isAnswer) {
        return <Icon type="close" size={24} color={theme.colors.secondary.red} />;
      }
      // 내가 선택하지 않은 나머지 옵션들
      return null;
    }

    // 정답 표시 전 상태
    return isMyChoice ? (
      <Icon type="check" size={24} color={theme.colors.primary.mint} />
    ) : (
      <SelectCircle pointerEvents="none" />
    );
  };

  return (
    <BaseOptionComponent
      content={content}
      backgroundColor={styleProps().backgroundColor}
      borderColor={styleProps().borderColor}
      textColor={styleProps().textColor}
      onPress={onPress}
    >
      {rightContent()}
    </BaseOptionComponent>
  );
};

export default QuizOption;
