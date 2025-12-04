import { ErrorConfig } from '@/src/shared/types/error';

// 앱 버전 체크 관련 에러
export const APP_VERSION_CHECK_ERROR: ErrorConfig = {
  APP_VERSION_NOT_FOUND: {
    code: 'APP_VERSION_NOT_FOUND',
    message: 'cannot find app version. please check your installation.',
    httpStatus: 0,
  },
  UNKNOWN_STATUS: {
    code: 'UNKNOWN_STATUS',
    message: 'unknown error occurred. please try again later.',
    httpStatus: 0,
  },
  INVALID_PLATFORM: {
    code: 'INVALID_PLATFORM',
    message: 'invalid platform information. please check your installation.',
    httpStatus: 400,
  },
  VERSION_INFO_NOT_FOUND: {
    code: 'VERSION_INFO_NOT_FOUND',
    message: 'cannot find version information. please check your installation.',
    httpStatus: 404,
  },
} as const;
