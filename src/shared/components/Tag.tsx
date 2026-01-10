import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

type TagProps = {
  label: string;
  selected?: boolean;
  onPress?: (tag: string) => void;
};

export default function Tag({ label, selected = false, onPress }: TagProps) {
  return (
    <TagContainer selected={selected} onPress={() => onPress && onPress(label)}>
      <TagText selected={selected}>{label}</TagText>
      {selected && <Icon type="close" size={16} color={theme.colors.primary.mint} />}
    </TagContainer>
  );
}

const TagContainer = styled.TouchableOpacity<{ selected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-width: 1px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.primary.mint : theme.colors.gray.gray_1)};
  border-radius: 999px;
  padding: 6px 12px;
`;

const TagText = styled.Text<{ selected: boolean }>`
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
  color: ${({ theme, selected }) => (selected ? theme.colors.primary.mint : theme.colors.primary.white)};
  margin-top: 2px;
`;
