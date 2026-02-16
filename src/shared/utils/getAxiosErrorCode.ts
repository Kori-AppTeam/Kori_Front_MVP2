import axios from 'axios';

// TODO 추후 공통 에러 핸들링 논의 후 수정 필요

/**
 * Axios 에러 코드 추출 유틸리티 함수
 * - Axios 에러 객체에서 서버가 반환한 커스텀 에러 코드를 추출합니다.
 * - Axios 에러가 아닌 경우 'UNKNOWN_ERROR'를 반환합니다.
 *
 * @param error 에러 객체
 * @returns 서버가 반환한 커스텀 에러 코드 또는 'UNKNOWN_ERROR'
 *
 */

export function getAxiosErrorCode(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const code = (error.response?.data as any)?.error_code;
    return code ? String(code) : 'UNKNOWN_ERROR';
  }
  return 'UNKNOWN_ERROR';
}
