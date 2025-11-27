import { LinkedSpace } from '@/src/features/linked-space/list/types';

// API 응답 타입 (chatRoomId 사용)
export type LinkedSpaceSearchResponse = {
  chatRoomId: number;
  roomImageUrl: string;
  roomName: string;
  description: string;
  userCount: string;
};

// LinkedSpace로 변환하는 유틸 함수
export const toLinkedSpace = (response: LinkedSpaceSearchResponse): LinkedSpace => ({
  roomId: response.chatRoomId,
  roomImageUrl: response.roomImageUrl,
  roomName: response.roomName,
  description: response.description,
  userCount: response.userCount,
});
