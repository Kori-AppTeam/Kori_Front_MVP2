// components/UserProfileCard/UserProfileCardActions.tsx

import CustomButton from '@/src/shared/components/CustomButton';
import React from 'react';
import styled from 'styled-components/native';
import { BUTTON_GAP } from './constants';
import type { UserProfileActions } from './types';

interface Props {
  actions?: UserProfileActions;
}

export function UserProfileCardActions({ actions }: Props) {
  if (!actions) return null;

  const { primary, secondary, decline, chat } = actions;

  return (
    <Container>
      {primary && (
        <CustomButton
          label={primary.label}
          tone="mint"
          filled
          leftIcon="add"
          onPress={primary.onPress}
          disabled={primary.disabled || primary.loading}
          isLoading={primary.loading}
        />
      )}
      {secondary && (
        <CustomButton
          label={secondary.label}
          tone="black"
          filled={false}
          leftIcon="check"
          borderColor="#949899"
          labelColor="#949899"
          onPress={secondary.onPress}
          disabled={secondary.disabled || secondary.loading}
          isLoading={secondary.loading}
        />
      )}
      {decline && (
        <CustomButton label={decline.label} tone="danger" filled leftIcon="close" onPress={decline.onPress} />
      )}
      {chat && (
        <CustomButton
          label="Chat"
          tone="black"
          filled
          leftIcon="chat-bubble-outline"
          onPress={chat.onPress}
          disabled={chat.disabled || chat.loading}
          isLoading={chat.loading}
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  margin-top: 16px;
  flex-direction: row;
  gap: ${BUTTON_GAP}px;
`;
