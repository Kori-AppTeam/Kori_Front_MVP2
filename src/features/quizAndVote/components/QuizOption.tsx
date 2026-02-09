import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import React from 'react';
import { BaseOptionComponent, SelectCircle } from './BaseOption';

interface QuizOptionProps {
  optionId: number;
  content: string;
  correctOptionId?: number | null;
  isCorrect?: boolean;
  isSelected?: boolean;
  isResult?: boolean;
  onPress?: () => void;
}

const QuizOption = ({
  optionId,
  content,
  isCorrect,
  isSelected,
  isResult,
  onPress,
  correctOptionId,
}: QuizOptionProps) => {
  const isAnswer = correctOptionId === optionId; // 정답 여부
  const isMyChoice = isSelected; // 내가 선택한 옵션인지 여부

  // 하이브리드 로직: 참여 직후(isCorrect 사용) + 조회 시(isAnswer 사용)
  const isMyCorrectChoice = isMyChoice && (isCorrect === true || (isCorrect == null && isAnswer));
  const isMyWrongChoice =
    isMyChoice && (isCorrect === false || (isCorrect == null && !isAnswer && correctOptionId !== null));

  // 옵션 스타일 결정
  const styleProps = () => {
    // 결과가 보여지는 상태일 때
    if (isResult) {
      // 내가 정답을 맞춘 경우 - 초록색
      if (isMyCorrectChoice) {
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary.mint,
          textColor: theme.colors.primary.mint,
        };
      }
      // 내가 오답을 선택한 경우 - 빨간색
      if (isMyWrongChoice) {
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.secondary.red,
          textColor: theme.colors.secondary.red,
        };
      }
      // 정답 옵션 표시 (내가 선택하지 않았지만 정답인 경우) - 초록색
      if (isAnswer) {
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary.mint,
          textColor: theme.colors.primary.mint,
        };
      }
      // 내가 선택하지 않은 나머지 옵션들
      return {
        backgroundColor: 'transparent',
        borderColor: theme.colors.gray.darkGray_2,
        textColor: theme.colors.gray.gray_1,
      };
    }

    // 내가 선택한 옵션인 경우(결과 공개 전, 낙관적 업데이트 상태)
    if (isMyChoice) {
      return {
        backgroundColor: theme.colors.gray.darkGray_2,
        borderColor: 'transparent',
        textColor: theme.colors.primary.white,
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
      // 내가 정답을 맞춘 경우 - 초록 체크
      if (isMyCorrectChoice) {
        return <Icon type="check" size={24} color={theme.colors.primary.mint} />;
      }
      // 내가 오답을 선택한 경우 - 빨간 X
      if (isMyWrongChoice) {
        return <Icon type="close" size={24} color={theme.colors.secondary.red} />;
      }
      // 정답 옵션 표시 (내가 선택하지 않았지만 정답인 경우) - 초록 체크
      if (isAnswer) {
        return <Icon type="check" size={24} color={theme.colors.primary.mint} />;
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
