// components/UserProfileCard/index.tsx

import Icon from '@/components/common/Icon';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import {
  CARD_MAX_WIDTH,
  CARD_OUTER_GAP,
  CARD_RADIUS,
  CHEVRON,
  DIVIDER_COLOR,
  PADDING_BOTTOM,
  PADDING_HORIZONTAL,
  PADDING_TOP,
} from './constants';
import type { UserProfileCardProps } from './types';
import { UserProfileCardActions } from './UserProfileCardActions';
import { UserProfileCardDetails } from './UserProfileCardDetails';
import { UserProfileCardHeader } from './UserProfileCardHeader';

export default function UserProfileCard(props: UserProfileCardProps) {
  const { user, actions, collapsible = false, defaultExpanded = false, footerSlot } = props;

  const [expanded, setExpanded] = useState(Boolean(defaultExpanded));

  return (
    <CardWrap>
      <CardInner
        style={Platform.select({
          ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
          android: { elevation: 2 },
        })}
      >
        <UserProfileCardHeader
          name={`${user.firstname} ${user.lastname}`}
          country={user.country}
          birth={user.birthday}
          gender={user.gender}
          bio={user.introduction}
          imageKey={user.imageKey}
          expanded={expanded}
        />

        <DividerWrap>
          <Divider />
          {collapsible && (
            <ChevronButton onPress={() => setExpanded(!expanded)}>
              <Icon type={expanded ? 'arrowUp' : 'arrowDown'} size={24} />
            </ChevronButton>
          )}
        </DividerWrap>

        {expanded && <UserProfileCardDetails purpose={user.purpose} languages={user.language} interests={user.hobby} />}

        <UserProfileCardActions actions={actions} />

        {footerSlot}
      </CardInner>
    </CardWrap>
  );
}

// Export types for convenience
export * from './types';

const CardWrap = styled.View`
  width: 100%;
  align-self: stretch;
  padding: 0 ${PADDING_HORIZONTAL}px;
  margin: ${CARD_OUTER_GAP / 2}px 0;
`;

const CardInner = styled.View`
  align-self: center;
  width: 100%;
  max-width: ${CARD_MAX_WIDTH}px;
  background-color: #ffffff;
  border-radius: ${CARD_RADIUS}px;
  padding: ${PADDING_TOP}px ${PADDING_HORIZONTAL}px ${PADDING_BOTTOM}px ${PADDING_HORIZONTAL}px;
`;

const DividerWrap = styled.View`
  position: relative;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  margin-top: 9px;
  margin-bottom: 18px;
`;

const Divider = styled.View`
  height: 1px;
  align-self: stretch;
  background-color: ${DIVIDER_COLOR};
`;

const ChevronButton = styled.Pressable`
  position: absolute;
  top: 50%;
  margin-top: -${CHEVRON.lift}px;
  width: ${CHEVRON.size}px;
  height: ${CHEVRON.size}px;
  border-radius: ${CHEVRON.size / 2}px;
  border-width: ${CHEVRON.ring}px;
  border-color: #dcdcdc;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;
