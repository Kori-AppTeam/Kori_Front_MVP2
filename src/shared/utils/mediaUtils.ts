import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';

// ============= 상수 =============
export const MEDIA_CONFIG = {
  // 이미지
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'gif'],

  // 동영상
  MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_VIDEO_FORMATS: ['mp4', 'mov'],

  // 공통
  VIDEO_MAX_DURATION: 300, // 5분 (초)
} as const;

// ============= 유틸리티 함수 =============

/**
 * 파일 확장자 추출
 */
export const getFileExtension = (uri: string): string => {
  const parts = uri.split('.');
  return parts[parts.length - 1].toLowerCase();
};

/**
 * MIME 타입 추출
 */
export const getMimeType = (uri: string, type: 'IMAGE' | 'VIDEO'): string => {
  const ext = getFileExtension(uri);

  if (type === 'IMAGE') {
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      default:
        return 'image/jpeg';
    }
  } else {
    // VIDEO
    switch (ext) {
      case 'mp4':
        return 'video/mp4';
      case 'mov':
        return 'video/quicktime';
      default:
        return 'video/mp4';
    }
  }
};

/**
 * 파일 크기 검증
 */
export const validateFileSize = async (uri: string, type: 'IMAGE' | 'VIDEO'): Promise<boolean> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (!fileInfo.exists || !fileInfo.size) {
      return false;
    }

    const maxSize = type === 'IMAGE' ? MEDIA_CONFIG.MAX_IMAGE_SIZE : MEDIA_CONFIG.MAX_VIDEO_SIZE;

    return fileInfo.size <= maxSize;
  } catch (error) {
    console.error('파일 크기 검증 실패:', error);
    return false;
  }
};

/**
 * 파일 형식 검증
 */
export const validateFileFormat = (uri: string, type: 'IMAGE' | 'VIDEO'): boolean => {
  const ext = getFileExtension(uri);
  const allowedFormats = type === 'IMAGE' ? MEDIA_CONFIG.ALLOWED_IMAGE_FORMATS : MEDIA_CONFIG.ALLOWED_VIDEO_FORMATS;

  return (allowedFormats as readonly string[]).includes(ext);
};

/**
 * UUID 기반 파일명 생성
 */
export const generateFileName = (originalUri: string): string => {
  const ext = getFileExtension(originalUri);
  const uuid = Crypto.randomUUID();
  return `${uuid}.${ext}`;
};
