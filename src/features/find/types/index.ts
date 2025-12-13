// src/features/find/types/index.ts

/**
 * UI에서 사용하는 친구 데이터 (DTO와 동일하게 유지)
 */
export type FriendItem = {
  userId: number;
  firstname: string;
  lastname: string;
  gender: 'Male' | 'Female';
  birthday: number; // YYYY 형식
  country: string;
  introduction: string;
  purpose: string;
  language: string[];
  hobby: string[];
  imageKey: string;
};

/**
 * 팔로우 요청 응답
 */
export type FollowResponse = {
  message: string;
  data: string;
  timestamp: string;
};

/**
 * 링크드 스페이스 추천 응답
 */
export type LinkedSpaceRecommendation = {
  roomId: number;
  roomName: string;
  roomImageUrl: string;
};
