import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

type ChipProps = {
  value: string;
  onPress?: (keyword: string) => void;
  bgColor?: string;
  textColor?: string;
};

const Chip = ({ value, onPress, bgColor, textColor }: ChipProps) => {
  return (
    <ChipContainer onPress={() => onPress && onPress(value)} bgColor={bgColor}>
      <ChipText textColor={textColor}>{value}</ChipText>
    </ChipContainer>
  );
};

export default Chip;

const ChipContainer = styled.Pressable<{ bgColor?: string }>`
  background-color: ${(props) => props.bgColor || theme.colors.gray.darkGray_1_5};
  padding: 10px 12px;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  max-height: 44px;
  align-self: flex-start;
`;

const ChipText = styled.Text<{ textColor?: string }>`
  ${({ theme }) => textStyle(theme.fonts.body.B4_R)};
  color: ${(props) => props.textColor || theme.colors.primary.white};
`;
