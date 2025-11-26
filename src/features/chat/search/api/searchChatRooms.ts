import api from '@/api/axiosInstance';
import { MyChatRoom } from '@/src/features/chat/list/types';
import { LinkedSpace } from '@/src/features/linked-space/list/types';
import { LinkedSpaceSearchResponse, toLinkedSpace } from '../types';

/**
 * My Chat 검색 API
 */
export const searchMyChatRooms = async (roomName: string): Promise<MyChatRoom[]> => {
  const res = await api.get(`/api/v1/chat/rooms/search?roomName=${encodeURIComponent(roomName)}`);
  return res.data.data;
};

/**
 * Linked Space 검색 API
 */
export const searchGroupChatRooms = async (keyword: string): Promise<LinkedSpace[]> => {
  const res = await api.get(`/api/v1/chat/rooms/group/search?keyword=${encodeURIComponent(keyword)}`);
  const data: LinkedSpaceSearchResponse[] = res.data.data;

  // chatRoomId → roomId 변환
  return data.map(toLinkedSpace);
};
