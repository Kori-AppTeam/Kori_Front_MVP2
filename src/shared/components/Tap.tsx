import { textStyle } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

interface TapProps {
  text: string;
  selected?: boolean;
  onPress?: () => void;
}

const Tap = ({ text, selected = false, onPress }: TapProps) => {
  return (
    <TapContainer onPress={onPress} selected={selected}>
      <TapText selected={selected} numberOfLines={1} ellipsizeMode="tail">
        {text}
      </TapText>
    </TapContainer>
  );
};

export default Tap;

const TapContainer = styled.TouchableOpacity<{ selected: boolean }>`
  height: 44px;
  padding: 0 24px;
  justify-content: center;
  align-items: center;
  border-bottom-width: ${({ selected }) => (selected ? '2px' : '1px')};
  border-bottom-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary.mint : theme.colors.gray.darkGray_1};
`;

const TapText = styled.Text<{ selected: boolean }>`
  text-align: center;
  color: ${({ theme, selected }) => (selected ? theme.colors.primary.mint : theme.colors.gray.darkGray_2)};
  ${({ theme }) => textStyle(theme.fonts.body.B4_M)};
`;
