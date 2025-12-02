import Icon from '@/components/common/Icon';
import { textStyle } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

interface AnonymousToggleProps {
  active: boolean;
  canToggle: boolean;
  loading?: boolean;
  onPress: () => void;
}

export function AnonymousToggle({ active, canToggle, loading = false, onPress }: AnonymousToggleProps) {
  return (
    <Anon $active={active} $disabled={!canToggle} onPress={onPress}>
      <AnonText $active={active}>
        {loading ? 'Anonymous (checking...)' : canToggle ? 'Anonymous' : 'Anonymous (only Free talk & Q&A)'}
      </AnonText>

      {active ? <Icon type="checkMintBox" size={16} /> : <Icon type="checkGrayBox" size={16} />}
    </Anon>
  );
}

const Anon = styled.Pressable<{ $active?: boolean; $disabled?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;
const AnonText = styled.Text<{ $active?: boolean }>`
  color: ${({ $active, theme }) => ($active ? theme.colors.primary.mint : theme.colors.gray.gray_1)};
  ${({ theme }) => textStyle(theme.fonts.small.small_M)};
`;
