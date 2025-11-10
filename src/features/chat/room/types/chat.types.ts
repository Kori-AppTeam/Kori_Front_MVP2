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