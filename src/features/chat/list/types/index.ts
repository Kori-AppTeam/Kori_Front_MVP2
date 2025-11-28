export type MyChatRoom = {
  roomId: number;
  roomName: string;
  lastMessageContent: string;
  lastMessageTime: string;
  roomImageUrl: string;
  unreadCount: number;
  participantCount: number;
};

export type UseChatRoomSubscriptionProps = {
  onRoomUpdate: (room: MyChatRoom) => void;
  enabled?: boolean;
};
