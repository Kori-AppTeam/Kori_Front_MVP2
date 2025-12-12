import { ErrorConfig } from '@/src/shared/types/error';
import { statusCodes } from '@react-native-google-signin/google-signin';

// 알 수 없는 에러
// TODO 추후 공통 에러 파일로 분리 필요
export const UNKNOWN_ERROR: ErrorConfig = {
  UNKNOWN_ERROR: { message: 'An unknown error occurred.' },
};

// 이메일 로그인 에러
export const EMAIL_LOGIN_ERROR: ErrorConfig = {
  ...UNKNOWN_ERROR,
  USER_NOT_FOUND: {
    httpStatus: 404,
    message: 'The account does not exist.',
  },

  AUTHENTICATION_FAILED: {
    httpStatus: 401,
    message: 'Password is incorrect.',
  },
} as const;

// oauth 공통 에러
const COMMON_AUTH_ERROR: ErrorConfig = {
  EMAIL_ALREADY_REGISTERED: {
    httpStatus: 409,
    message: 'The email is already registered with another account.',
    subMessage: 'Please check your email address.',
  },
  DUPLICATE_EMAIL_PROVIDER_MISMATCH: {
    httpStatus: 409,
    message: 'Already registered with another social account.',
    subMessage: 'Please check your email address.',
  },
};

// 애플 소셜 로그인 에러
export const APPLE_AUTH_ERROR: ErrorConfig = {
  ...COMMON_AUTH_ERROR,
  ...UNKNOWN_ERROR,
  ERR_REQUEST_CANCELED: { code: 'ERR_REQUEST_CANCELED', message: 'User canceled the Apple login process.' },
  ERR_REQUEST_FAILED: { code: 'ERR_REQUEST_FAILED', message: 'Failed to connect to Apple servers.' },
};

// 구글 소셜 로그인 에러
export const GOOGLE_AUTH_ERROR: ErrorConfig = {
  ...COMMON_AUTH_ERROR,
  ...UNKNOWN_ERROR,
  [statusCodes.SIGN_IN_CANCELLED]: { message: 'User canceled the Google login process.' },
  [statusCodes.IN_PROGRESS]: { message: 'Google sign in is already in progress.' },
  [statusCodes.PLAY_SERVICES_NOT_AVAILABLE]: {
    message: 'Google Play Services are not available or outdated.',
  },
  GOOGLE_NO_AUTH_CODE: { message: 'Failed to verify Google account information.' },
};

export const EMAIL_SIGNUP_ERROR: ErrorConfig = {
  ...UNKNOWN_ERROR,
  // TODO 공통 에러 추가
};
