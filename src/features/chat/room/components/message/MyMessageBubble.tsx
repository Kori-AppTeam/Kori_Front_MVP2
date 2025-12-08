// 나의 메시지 버블 컴포넌트(단일 메시지)
import React, { forwardRef } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { MyMessageBubbleProps } from '../../types';
import HighlightText from './HighlightText';

const MyMessageBubble = forwardRef<View, MyMessageBubbleProps>(
  ({ content, time, showTime, isFirst, searchKeyword, onLongPress }, ref) => {
    return (
      <MessageContainer ref={ref} onLongPress={onLongPress}>
        {showTime && <TimeText>{time}</TimeText>}
        <BubbleContainer isFirst={isFirst}>
          <HighlightText text={content} keyword={searchKeyword} textType="my" />
        </BubbleContainer>
      </MessageContainer>
    );
  },
);

export default MyMessageBubble;

// ============= Constants =============
const MY_MESSAGE_CONFIG = {
  MAX_WIDTH: 280,
  BUBBLE_MAX_WIDTH: 210,
  PADDING_VERTICAL: 8,
  PADDING_HORIZONTAL: 12,
  BORDER_RADIUS: 16,
  BACKGROUND_COLOR: '#02f59b',
  TIME_COLOR: '#848687',
  TEXT_COLOR: '#1d1e1f',
  MARGIN_RIGHT: 8,
  MARGIN_TOP_FIRST: 30,
  MARGIN_TOP_REGULAR: 5,
  TIME_MARGIN_RIGHT: 4,
  TIME_FONT_SIZE: 10,
} as const;

// ============= Base Styled Components =============
const BaseContainer = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})`
  align-self: flex-end;
  max-width: ${MY_MESSAGE_CONFIG.MAX_WIDTH}px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  margin-right: ${MY_MESSAGE_CONFIG.MARGIN_RIGHT}px;
`;

const BaseBubble = styled.View`
  background-color: ${MY_MESSAGE_CONFIG.BACKGROUND_COLOR};
  padding: ${MY_MESSAGE_CONFIG.PADDING_VERTICAL}px ${MY_MESSAGE_CONFIG.PADDING_HORIZONTAL}px;
  max-width: ${MY_MESSAGE_CONFIG.BUBBLE_MAX_WIDTH}px;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
`;

// ============= Styled Components =============
const MessageContainer = styled(BaseContainer)`
  margin-top: ${MY_MESSAGE_CONFIG.MARGIN_TOP_REGULAR}px;
`;

const BubbleContainer = styled(BaseBubble)<{ isFirst: boolean }>`
  border-radius: ${MY_MESSAGE_CONFIG.BORDER_RADIUS}px;
  border-bottom-right-radius: ${({ isFirst }) => (isFirst ? 0 : MY_MESSAGE_CONFIG.BORDER_RADIUS)}px;
`;

const TimeText = styled.Text`
  color: ${MY_MESSAGE_CONFIG.TIME_COLOR};
  font-size: ${MY_MESSAGE_CONFIG.TIME_FONT_SIZE}px;
  font-family: PlusJakartaSans_300Light;
  margin-right: ${MY_MESSAGE_CONFIG.TIME_MARGIN_RIGHT}px;
`;
