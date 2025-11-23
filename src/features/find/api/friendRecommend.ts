// src/features/find/api/recommend.ts

import api from '@/api/axiosInstance';
import type { RecommendedFriendDto } from '../types';

/**
 * 추천 친구 목록 조회
 * @param limit 조회할 친구 수
 */
export async function getRecommendedFriends(limit: number = 50): Promise<RecommendedFriendDto[]> {
  const { data } = await api.get('/api/v1/commend/content-based', {
    params: { limit },
  });
  return data ?? [];
}
