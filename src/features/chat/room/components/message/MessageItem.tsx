//MyMessageBubble과 OtherMessageBubble을 조합한 형태의 메시지 아이템 컴포넌트
import { formatDate, formatTime } from '@/src/shared/utils/dateUtils';
import { theme } from '@/src/styles/theme';
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import { useChatStore } from '../../stores/useChatStore';
import { useSearchStore } from '../../stores/useSearchStore';
import { MessageItemProps } from '../../types';
import { displayMessageItem } from '../../utils/displayMessageItem';
import MediaMessage from './MediaMessage';
import MessageMenu from './MessageMenu';
import MyMessageBubble from './MyMessageBubble';
import OtherMessageBubble from './OtherMessageBubble';

const MessageItem: React.FC<MessageItemProps> = ({ item, index, isMyMessage, onDeleteMessage, onProfilePress }) => {
  // Store에서 직접 가져오기
  const { isActive, searchResults, currentIndex, searchText } = useSearchStore();
  const isTranslating = useChatStore((state) => state.isTranslating);
  const { retryUpload } = useMediaUpload();

  // 컨텍스트 메뉴 상태 관리
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [messageHeight, setMessageHeight] = useState(0);
  const bubbleRef = useRef<View>(null);

  // 날짜 및 시간 표시, 동일 사용자 판단
  const displayLogic = displayMessageItem(item, index);

  // 메시지 콘텐츠 (번역 여부에 따라)
  const messageContent = isTranslating ? item.targetContent : item.originContent;

  // 메시지 강조 표시 여부
  const shouldHighlight = isActive && searchResults.length > 0 && searchResults[currentIndex]?.id === item.id;

  // 미디어 메시지 여부
  const isMediaMessage = item.messageType === 'IMAGE' || item.messageType === 'VIDEO';

  // 재시도 핸들러
  const handleRetry = () => {
    if (item.tempId) {
      retryUpload(item.tempId);
    }
  };

  // 길게 누르기 핸들러
  const handleLongPress = () => {
    bubbleRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({ x: pageX, y: pageY });
      setMessageHeight(height);
      setMenuVisible(true);
    });
  };

  return (
    <>
      {/* 메시지 */}
      {isMediaMessage ? (
        // 미디어 메시지 (IMAGE/VIDEO)
        <MediaMessageContainer isMyMessage={isMyMessage}>
          <MediaMessage
            type={item.messageType as 'IMAGE' | 'VIDEO'}
            localUrl={item.localUrl}
            mediaUrl={item.mediaUrl}
            thumbnailUrl={item.thumbnailUrl || undefined}
            uploadStatus={item.uploadStatus}
            errorMessage={item.errorMessage}
            onRetry={handleRetry}
            maxWidth={250}
          />
        </MediaMessageContainer>
      ) : isMyMessage ? (
        // 텍스트 메시지 (내 메시지)
        <MyMessageBubble
          ref={bubbleRef}
          content={messageContent}
          time={formatTime(item.sentAt)}
          showTime={displayLogic.showTime}
          isFirst={!displayLogic.isSameUserAbove}
          searchKeyword={shouldHighlight ? searchText : undefined}
          onLongPress={handleLongPress}
        />
      ) : (
        // 텍스트 메시지 (상대 메시지)
        <OtherMessageBubble
          ref={bubbleRef}
          content={messageContent}
          time={formatTime(item.sentAt)}
          senderName={item.senderFirstName + ' ' + item.senderLastName}
          senderImageUrl={item.senderImageUrl}
          showTime={displayLogic.showTime}
          showProfile={displayLogic.showProfile}
          isFirst={!displayLogic.isSameUserAbove}
          searchKeyword={shouldHighlight ? searchText : undefined}
          onProfilePress={() => onProfilePress(item.senderId)}
          onLongPress={handleLongPress}
        />
      )}

      {/* 날짜 구분선 */}
      {displayLogic.showDate && (
        <DateSeparator>
          <DateText>{formatDate(item.sentAt)}</DateText>
        </DateSeparator>
      )}

      {/* 컨텍스트 메뉴 */}
      <MessageMenu
        visible={menuVisible}
        position={menuPosition}
        messageHeight={messageHeight}
        isMyMessage={isMyMessage}
        content={messageContent}
        onDelete={isMyMessage ? () => onDeleteMessage(item.id) : undefined}
        onClose={() => setMenuVisible(false)}
      />
    </>
  );
};

export default MessageItem;

// ============= Styled Components =============
const DateSeparator = styled.View`
  margin: 20px 0px;
  justify-content: center;
  align-items: center;
`;

const DateText = styled.Text`
  color: ${theme.colors.gray.gray_1};
  ${theme.fonts.small.small_SB};
`;

const MediaMessageContainer = styled.View<{ isMyMessage: boolean }>`
  flex-direction: row;
  align-items: flex-end;
  align-self: ${({ isMyMessage }) => (isMyMessage ? 'flex-end' : 'flex-start')};
  margin: 5px 8px;
  gap: 4px;
`;
