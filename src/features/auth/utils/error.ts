import axios from 'axios';

// type guard: error 객체에 code 속성이 있는지 확인
function isErrorWithCode(error: unknown): error is { code: string | number } {
  return typeof error === 'object' && error !== null && 'code' in error;
}

export function getAuthErrorCode(error: unknown, provider: 'apple' | 'google'): string {
  // 1. Axios 에러 (서버에서 받은 에러) - 서버가 던진 커스텀 에러 코드를 반환
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error_code || 'UNKNOWN_ERROR';
  }

  // 2. SDK 에러 (code 속성이 있는 경우)
  if (isErrorWithCode(error)) {
    const code = String(error.code);
    return code;
  }

  // 3. 알 수 없는 에러
  return 'UNKNOWN_ERROR';
}
