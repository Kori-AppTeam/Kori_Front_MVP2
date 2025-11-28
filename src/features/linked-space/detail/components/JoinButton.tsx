import React from 'react';
import { JoinButtonText, JoinButton as StyledJoinButton } from '../styles';

type JoinButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

export const JoinButton = ({ onPress, disabled = false }: JoinButtonProps) => {
  return (
    <StyledJoinButton onPress={onPress} disabled={disabled}>
      <JoinButtonText>Join</JoinButtonText>
    </StyledJoinButton>
  );
};
