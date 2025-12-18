// src/features/find/types/index.ts

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
