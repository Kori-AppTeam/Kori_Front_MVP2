// ============= Base Types =============
export interface BaseMessageProps {
  content: string;
  time: string;
  showTime: boolean;
  showProfile?: boolean;
  searchKeyword?: string;
}

export interface MessageStyleProps {
  showProfile?: boolean;
  isFirst?: boolean;
  maxWidth?: number;
}

// ============= Message Components =============
export interface MyMessageBubbleProps extends BaseMessageProps {
  isFirst: boolean;
  onLongPress: () => void;
}

export interface OtherMessageBubbleProps extends BaseMessageProps {
  senderName: string;
  senderImageUrl: string;
  isFirst: boolean;
  onProfilePress: () => void;
}

export interface MessageItemProps {
  item: ChatMessage;
  index: number;
  messages: ChatMessage[];
  isMyMessage: boolean;
  isTranslate: boolean;
  searchKeyword?: string;
  isCurrentMessage?: (messageId: number) => boolean;
  onDeleteMessage: (id: number) => void;
  onProfilePress: (senderId: number) => void;
}

export interface MessageListProps {
  messages: ChatMessage[];
  myUserId: string;
  isTranslate: boolean;
  searchKeyword?: string;
  isCurrentMessage?: (messageId: number) => boolean;
  onLoadMore: () => void;
  onDeleteMessage: (id: number) => void;
  onProfilePress: (senderId: number) => void;
  flatListRef?: React.RefObject<any>;
}

// ============= Header Components =============
export interface HeaderProps {
  roomName: string;
  onSearchSubmit: () => void;
  onShowMembers: () => void;
}

export interface ChatHeaderProps {
  roomName: string;
  onShowMembers: () => void;
  onSearchToggle: () => void;
}

export interface SearchHeaderProps {
  onSearchSubmit: () => void;
}

// ============= Input Components =============
export interface MessageInputProps {
  message: string;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
  paddingBottom?: number;
}

export interface TranslateButtonProps {
  isTranslating: boolean;
  onToggle: () => void;
  position?: 'fixed' | 'center';
}

// ============= Search Components =============
export interface SearchNavigationProps {
  onNavigateUp: () => void;
  onNavigateDown: () => void;
  searchResultText: string;
}

// ============= Highlight Text =============
export interface HighlightTextProps {
  text: string;
  keyword: string | undefined;
  textType: 'my' | 'other';
  highlightStyle?: {
    backgroundColor?: string;
  };
}

export interface ChatMessage {
  id: number;
  roomId: number;
  senderId: number;
  senderFirstName: string;
  senderLastName: string;
  senderImageUrl: string;
  originContent: string;
  targetContent: string;
  sentAt: string;
  messageType: string;
}

export interface ChatMessagesState {
  message: string;
  messages: ChatMessage[];
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  error: Error | null;
}

// Room별 메시지 상태
export interface RoomMessagesState {
  messages: ChatMessage[];
  currentMessage: string;
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  error: Error | null;
}