// src/features/find/api/follow.ts

import api from '@/api/axiosInstance';
import type { FollowResponse } from '../types';

const TEST_TARGETS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

/**
 * 개발 환경에서 더미 userId를 실제 테스트 타겟으로 매핑
 */
function mapDummyToReal(userId: number) {
  if (__DEV__ && userId >= 100000 && userId < 200000) {
    const mapped = TEST_TARGETS[(userId - 100000) % TEST_TARGETS.length];
    return mapped;
  }
  return userId;
}

/**
 * 팔로우 요청 전송
 * @param userId 팔로우할 사용자 ID
 */
export async function postFollow(userId: number): Promise<FollowResponse> {
  const targetId = mapDummyToReal(userId);
  const { data } = await api.post<FollowResponse>(`/api/v1/mypage/follow/${targetId}`, {});
  return data;
}

/**
 * 팔로우 요청 취소
 * @param userId 취소할 사용자 ID
 */
export async function cancelFollowRequest(userId: number): Promise<unknown> {
  const { data } = await api.delete(`/api/v1/mypage/users/follow/${userId}`);
  return data;
}
