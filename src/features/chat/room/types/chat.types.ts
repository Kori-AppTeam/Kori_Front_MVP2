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