import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useChatStore } from '../../stores/useChatStore';
import { MessageListProps } from '../../types';
import { ChatMessage } from '../../types/index';
import MessageItem from './MessageItem';

const MessageList: React.FC<MessageListProps> = ({
  myUserId,
  onLoadMore,
  onDeleteMessage,
  onProfilePress,
  flatListRef,
}) => {
  const messages = useChatStore((state) => state.messages);
  const [maintainPosition, setMaintainPosition] = useState(false);

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => (
    <MessageItem
      item={item}
      index={index}
      isMyMessage={myUserId === item.senderId.toString()}
      onDeleteMessage={onDeleteMessage}
      onProfilePress={onProfilePress}
    />
  );

  return (
    <ListContainer>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        inverted
        // 스크롤 이벤트로 사용자가 위로 스크롤 중인지 감지
        onScroll={useCallback((e: { nativeEvent: { contentOffset: { y: number } } }) => {
          const y = e.nativeEvent.contentOffset.y;
          // inverted FlatList 기준: y > threshold면 사용자가 위(이전 메시지)를 보고 있음
          setMaintainPosition(y > 20);
        }, [])}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={LIST_CONFIG.CONTENT_CONTAINER_STYLE}
        onEndReached={onLoadMore}
        onEndReachedThreshold={LIST_CONFIG.END_REACHED_THRESHOLD}
        renderItem={renderMessage}
        removeClippedSubviews={true}
        maxToRenderPerBatch={LIST_CONFIG.MAX_TO_RENDER_PER_BATCH}
        windowSize={LIST_CONFIG.WINDOW_SIZE}
        getItemLayout={LIST_CONFIG.GET_ITEM_LAYOUT}
        // 사용자가 위로 스크롤해 있을 때만 위치 유지 적용
        maintainVisibleContentPosition={maintainPosition ? { minIndexForVisible: 0 } : undefined}
      />
    </ListContainer>
  );
};

export default MessageList;

// ============= Constants =============
const LIST_CONFIG = {
  END_REACHED_THRESHOLD: 0.2,
  MAX_TO_RENDER_PER_BATCH: 10,
  WINDOW_SIZE: 10,
  CONTENT_CONTAINER_STYLE: {
    flexGrow: 1,
    justifyContent: 'flex-end' as const,
    paddingTop: 10,
    paddingBottom: 10,
  },
  // 성능 최적화를 위한 getItemLayout (선택사항)
  GET_ITEM_LAYOUT: undefined, // 메시지 높이가 가변적이므로 undefined로 설정
} as const;

// ============= Styled Components =============
const ListContainer = styled.View`
  flex: 1;
  flex-direction: column;
  padding-bottom: 10px;
`;
