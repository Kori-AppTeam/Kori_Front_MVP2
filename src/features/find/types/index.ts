// src/features/find/types/index.ts

/**
 * 서버에서 받아오는 추천 친구 DTO
 */
export type RecommendedFriendDto = {
  userId: number;
  firstname: string;
  lastname: string;
  gender: 'Male' | 'Female' | 'unspecified';
  birthday: number; // YYYY 형식
  country: string;
  introduction: string;
  purpose: string;
  language: string[];
  hobby: string[];
  imageKey: string;
};

/**
 * UI에서 사용하는 친구 데이터 (DTO와 동일하게 유지)
 */
export type FriendItem = {
  userId: number;
  firstname: string;
  lastname: string;
  gender: 'Male' | 'Female' | 'unspecified';
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
 * 팔로잉 상태 응답
 */
export type FollowingUser = {
  id?: number;
  userId?: number;
  [key: string]: any;
};
