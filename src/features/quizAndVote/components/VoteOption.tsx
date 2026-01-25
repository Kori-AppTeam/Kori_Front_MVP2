import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { BaseOptionComponent } from './BaseOption';

interface VoteOptionProps {
  optionId: number;
  content: string;
  isSelected?: boolean;
  isResult?: boolean;
  votePercentage?: number;
  onPress?: () => void;
}

const VoteOption = ({ optionId, content, isSelected, isResult, votePercentage, onPress }: VoteOptionProps) => {
  const styleProps = () => {
    // 결과가 보여지는 상태일 때
    if (isResult) {
      return {
        backgroundColor: 'transparent',
        borderColor: isSelected ? '#066642' : theme.colors.gray.darkGray_2,
        textColor: isSelected ? theme.colors.primary.mint : theme.colors.gray.gray_1,
      };
    }

    // 선택 전 상태
    return {
      backgroundColor: theme.colors.gray.darkGray_2,
      borderColor: 'transparent',
      textColor: theme.colors.primary.white,
    };
  };

  const rightContent = () => {
    // 결과가 보여지는 상태일 때(퍼센트 표시)
    if (isResult) {
      return (
        <>
          <PercentageText isSelected={isSelected}>{votePercentage}%</PercentageText>
        </>
      );
    }

    // 선택 전 상태
    return isSelected ? <Icon type="check" size={24} color={theme.colors.primary.mint} /> : null;
  };

  return (
    <BaseOptionComponent
      content={content}
      backgroundColor={styleProps().backgroundColor}
      borderColor={styleProps().borderColor}
      textColor={styleProps().textColor}
      backgroundChildren={
        isResult && votePercentage !== undefined ? (
          <VotePercentageBar percentage={votePercentage} isSelected={isSelected} />
        ) : undefined
      }
      onPress={onPress}
    >
      {rightContent()}
    </BaseOptionComponent>
  );
};

export default VoteOption;

const PercentageText = styled.Text<{ isSelected?: boolean }>`
  color: ${({ isSelected, theme }) => (isSelected ? theme.colors.primary.mint : theme.colors.gray.gray_2)};
  ${({ theme }) => textStyle(theme.fonts.body.B5_SB)};
  z-index: 1;
`;

const VotePercentageBar = styled.View<{ percentage: number; isSelected?: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${({ percentage }) => `${percentage}%`};
  background-color: ${({ isSelected, theme }) => (isSelected ? '#066642' : theme.colors.gray.darkGray_2)};
  z-index: 0;
`;
