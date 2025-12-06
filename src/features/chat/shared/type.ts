/** 팔로우 상태 */
export type FollowStatus = 'FOLLOWING' | 'PENDING' | 'NOT_FOLLOWING';

/** 사용자 프로필 데이터 (chat 전체에서 공통 사용) */
export interface UserProfileData {
  userId: number;
  id?: number;
  firstname: string;
  lastname: string;
  gender: string;
  birthday: number;
  introduction: string;
  purpose: string;
  country: string;
  language: [string];
  hobby: [string];
  imageKey: string;
  imageUrl?: string;
  userImageUrl?: string;
  followStatus?: FollowStatus;
}
