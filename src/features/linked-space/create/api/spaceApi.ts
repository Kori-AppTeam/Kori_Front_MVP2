import api from '@/api/axiosInstance';
import { CreateSpaceRequest } from '../types';

/**
 * 그룹 스페이스 생성 API
 */
export const createGroupSpace = async (payload: CreateSpaceRequest) => {
  const response = await api.post('/api/v1/chat/rooms/group', payload);
  return response.data;
};
