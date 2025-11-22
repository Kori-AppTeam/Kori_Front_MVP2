import { ImageSourcePropType } from 'react-native';

/**
 * 스페이스 생성 폼 데이터
 */
export interface CreateSpaceFormData {
  spaceName: string;
  description: string;
  imageUrl?: string;
  imageUri?: string; // 로컬 URI (커스텀 이미지인 경우)
  isCustomImage: boolean; // 커스텀 이미지 여부
  avatarIndex: number; // -1: 커스텀, 0-2: 기본 아바타
}

/**
 * 스페이스 생성 단계
 */
export type CreateSpaceStep = 'form' | 'loading' | 'success';

/**
 * 아바타 선택 상태
 */
export interface AvatarSelection {
  selectedAvatarIdx: number; // -1이면 커스텀 이미지
  customPhotoUri?: string;
  avatarUrl?: string;
}

/**
 * Presigned URL 응답
 */
export interface PresignedUrlInfo {
  putUrl: string;
  key: string;
  headers: Record<string, string>;
}

/**
 * 스페이스 생성 API 요청
 */
export interface CreateSpaceRequest {
  roomName: string;
  description: string;
  roomImageUrl: string;
}

/**
 * 기본 아바타 정보
 */
export interface DefaultAvatar {
  source: ImageSourcePropType;
  url: string;
}
