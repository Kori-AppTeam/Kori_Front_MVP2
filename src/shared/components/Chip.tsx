import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

type HotKeywordChipProps = {
  value: string;
  onPress?: (keyword: string) => void;
};

const Chip = ({ value, onPress }: HotKeywordChipProps) => {
  return (
    <ChipContainer onPress={() => onPress && onPress(value)}>
      <ChipText>{value}</ChipText>
    </ChipContainer>
  );
};

export default Chip;

const ChipContainer = styled.Pressable`
  background-color: ${theme.colors.gray.darkGray_1_5};
  padding: 10px 12px;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  max-height: 44px;
  align-self: flex-start;
`;

const ChipText = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B4_R)};
  color: ${theme.colors.primary.white};
`;
