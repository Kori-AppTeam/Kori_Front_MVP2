import api from '@/api/axiosInstance';
import { LinkedSpaceDetail } from '../types';

export const fetchLinkedSpaceDetail = async (linkedSpaceId: string): Promise<LinkedSpaceDetail> => {
  const res = await api.get(`/api/v1/chat/rooms/group/${linkedSpaceId}`);
  return res.data.data;
};

export const joinLinkedSpace = async (linkedSpaceId: string) => {
  const res = await api.post(`/api/v1/chat/rooms/group/${linkedSpaceId}/join`);
  return res.data;
};
