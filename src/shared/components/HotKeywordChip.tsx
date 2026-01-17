import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

type HotKeywordChipProps = {
  value: string;
  onPress?: (keyword: string) => void;
};

const HotKeywordChip = ({ value, onPress }: HotKeywordChipProps) => {
  return (
    <Badge onPress={() => onPress && onPress(value)}>
      <BadgeText>{value}</BadgeText>
    </Badge>
  );
};

export default HotKeywordChip;

const Badge = styled.Pressable`
  background-color: ${theme.colors.gray.darkGray_1_5};
  padding: 10px 12px;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  max-height: 44px;
  align-self: flex-start;
`;

const BadgeText = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B4_R)};
  color: ${theme.colors.primary.white};
`;
