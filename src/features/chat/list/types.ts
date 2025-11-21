export type ChatRoom = {
  roomId: string;
  roomName: string;
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
  roomImageUrl?: string;
  participantCount?: number;
};

export type UseChatRoomSubscriptionProps = {
  onRoomUpdate: (room: ChatRoom) => void;
  enabled?: boolean;
};