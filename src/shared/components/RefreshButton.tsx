import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

type RefreshButtonProps = {
  onPress?: () => void;
};

const RefreshButton = ({ onPress }: RefreshButtonProps) => {
  return (
    <Badge onPress={() => onPress && onPress()}>
      <Icon type="refresh" size={20} color={theme.colors.primary.mint} />
      <BadgeText>Refresh</BadgeText>
    </Badge>
  );
};

export default RefreshButton;

const Badge = styled.Pressable`
  border-radius: 100px;
  background-color: transparent;
  border: 1px solid ${theme.colors.primary.mint};
  gap: 4px;
  padding: 10px 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  max-height: 44px;
  align-self: flex-start;
`;

const BadgeText = styled.Text`
  color: ${theme.colors.primary.mint};
`;
