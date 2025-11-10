//MyMessageBubble과 OtherMessageBubble을 조합한 형태의 메시지 아이템 컴포넌트
import React from 'react';
import styled from 'styled-components/native';
import { formatDate, formatTime } from '../../../utils/dateUtils';
import { MessageItemProps } from '../../types/chat-ui.types';
import { displayMessageItem } from '../../utils/displayMessageItem';
import MyMessageBubble from './MyMessageBubble';
import OtherMessageBubble from './OtherMessageBubble';

const MessageItem: React.FC<MessageItemProps> = ({
  item,
  index,
  messages,
  isMyMessage,
  isTranslate,
  searchKeyword,
  isCurrentMessage,
  onDeleteMessage,
  onProfilePress,
}) => {

  // 메시지 표시 로직
  const displayLogic = displayMessageItem(item, index, messages);

  // 날짜 구분선 표시 여부
  const shouldShowDateSeparator = displayLogic.showDate;

  // 메시지 콘텐츠 (번역 여부에 따라)
  const messageContent = isTranslate ? item.targetContent : item.originContent;

  // 메시지 강조 표시 여부
  const shouldHighlight = isCurrentMessage ? isCurrentMessage(item.id) : false;

  return (
    <>
      {/* 메시지 */}
      {isMyMessage ? (
        <MyMessageBubble
          content={messageContent}
          time={formatTime(item.sentAt)}
          showTime={displayLogic.showTime}
          isFirst={!displayLogic.isSameUser}
          searchKeyword={shouldHighlight ? searchKeyword : undefined}
          onLongPress={() => onDeleteMessage(item.id)}
        />
      ) : (
        <OtherMessageBubble
          content={messageContent}
          time={formatTime(item.sentAt)}
          senderName={item.senderLastName}
          senderImageUrl={item.senderImageUrl}
          showTime={displayLogic.showTime}
          showProfile={displayLogic.showTime}
          isFirst={!displayLogic.isSameUser}
          searchKeyword={searchKeyword}
          onProfilePress={() => onProfilePress(item.senderId)}
        />
      )}

      {/* 날짜 구분선 */}
      {shouldShowDateSeparator && (
        <DateSeparator>
          <DateText>{formatDate(item.sentAt)}</DateText>
        </DateSeparator>
      )}
    </>
  );
};

export default MessageItem;

// ============= Constants =============
const DATE_SEPARATOR_CONFIG = {
  MARGIN_VERTICAL: 10,
  MARGIN_BOTTOM: 10,
  HEIGHT: 20,
  FONT_SIZE: 12,
  COLOR: '#848687',
} as const;

// ============= Styled Components =============
const DateSeparator = styled.View`
  margin: ${DATE_SEPARATOR_CONFIG.MARGIN_VERTICAL}px 0px ${DATE_SEPARATOR_CONFIG.MARGIN_BOTTOM}px 0px;
  height: ${DATE_SEPARATOR_CONFIG.HEIGHT}px;
  justify-content: center;
  align-items: center;
`;

const DateText = styled.Text`
  color: ${DATE_SEPARATOR_CONFIG.COLOR};
  font-size: ${DATE_SEPARATOR_CONFIG.FONT_SIZE}px;
  font-family: PlusJakartaSans_600SemiBold;
`;