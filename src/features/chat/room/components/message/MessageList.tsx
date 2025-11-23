import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useChatStore } from '../../stores/useChatStore';
import { MessageListProps } from '../../types';
import { ChatMessage } from '../../types/index';
import MessageItem from './MessageItem';

const MessageList: React.FC<MessageListProps> = ({
  myUserId,
  isTranslate,
  searchKeyword,
  isCurrentMessage,
  onLoadMore,
  onDeleteMessage,
  onProfilePress,
  flatListRef,
}) => {
  const messages = useChatStore((state) => state.messages);
  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => (
    <MessageItem
      item={item}
      index={index}
      messages={messages}
      isMyMessage={myUserId === item.senderId.toString()}
      isTranslate={isTranslate}
      searchKeyword={searchKeyword}
      isCurrentMessage={isCurrentMessage}
      onDeleteMessage={onDeleteMessage}
      onProfilePress={onProfilePress}
    />
  );

  return (
    <ListContainer>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        inverted
        showsVerticalScrollIndicator={false}
        contentContainerStyle={LIST_CONFIG.CONTENT_CONTAINER_STYLE}
        onEndReached={onLoadMore}
        onEndReachedThreshold={LIST_CONFIG.END_REACHED_THRESHOLD}
        renderItem={renderMessage}
        removeClippedSubviews={true}
        maxToRenderPerBatch={LIST_CONFIG.MAX_TO_RENDER_PER_BATCH}
        windowSize={LIST_CONFIG.WINDOW_SIZE}
        getItemLayout={LIST_CONFIG.GET_ITEM_LAYOUT}
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