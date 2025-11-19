export const AUTH_ERROR_CONFIG = {
  USER_NOT_FOUND: {
    httpStatus: 404,
    code: 'USER_NOT_FOUND',
    message: 'The account does not exist.',
  },

  AUTHENTICATION_FAILED: {
    httpStatus: 401,
    code: 'AUTHENTICATION_FAILED',
    message: 'Password is incorrect.',
  },

  // unknown fallback error
  UNKNOWN: {
    httpStatus: -1,
    code: 'UNKNOWN',
    message: 'An unknown error occurred.',
  },
} as const;

export type AuthErrorCode = keyof typeof AUTH_ERROR_CONFIG;

export function getAuthErrorMessage(code: string | undefined, httpStatus?: number): string {
  if (code && code in AUTH_ERROR_CONFIG) {
    return AUTH_ERROR_CONFIG[code as AuthErrorCode].message;
  }

  if (httpStatus) {
    const matched = Object.values(AUTH_ERROR_CONFIG).find((item) => item.httpStatus === httpStatus);
    if (matched) return matched.message;
  }

  return AUTH_ERROR_CONFIG.UNKNOWN.message;
}
