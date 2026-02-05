import { textStyle } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

interface BaseOptionProps {
  content: string;
  onPress?: () => void;
  children?: React.ReactNode;
  backgroundChildren?: React.ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

// 공통 베이스 옵션 컴포넌트
export const BaseOptionComponent = ({
  content,
  onPress,
  children,
  backgroundColor,
  borderColor,
  textColor,
  backgroundChildren,
}: BaseOptionProps) => {
  return (
    <OptionContainer backgroundColor={backgroundColor} borderColor={borderColor} onPress={onPress}>
      <TextContainer>
        <OptionText textColor={textColor}>{content}</OptionText>
        {children}
      </TextContainer>
      {backgroundChildren}
    </OptionContainer>
  );
};

export const OptionContainer = styled.Pressable<{ backgroundColor?: string; borderColor?: string }>`
  width: 100%;
  background-color: ${({ backgroundColor, theme }) => backgroundColor || theme.colors.gray.gray_2};
  border-width: ${({ borderColor }) => (borderColor ? '1px' : '0px')};
  border-color: ${({ borderColor, theme }) => borderColor || 'transparent'};
  border-radius: 8px;
  position: relative;
  overflow: hidden;
`;

export const TextContainer = styled.View`
  padding: 12px 20px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
`;

export const OptionText = styled.Text<{ textColor?: string }>`
  color: ${({ textColor, theme }) => textColor || theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
  z-index: 1;
`;

export const SelectCircle = styled.View`
  width: 18px;
  height: 18px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.gray.gray_2};
`;

export const ClosedDateContainer = styled.View`
  align-self: flex-start;
  justify-content: center;
  background-color: #1a4634;
  padding: 6px;
  border-radius: 4px;
  margin-bottom: 24px;
`;

export const ClosedDateText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.mint};
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
`;
