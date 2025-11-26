import api from '@/api/axiosInstance';
import { LinkedSpaceRecommendation } from '../types';

export const fetchLinkedSpaceRecommendation = async (): Promise<LinkedSpaceRecommendation> => {
  const res = await api.get('/api/v1/chat/rooms/recommend');
  return res.data.data;
};
