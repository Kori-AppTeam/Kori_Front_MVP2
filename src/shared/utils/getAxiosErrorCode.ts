import axios from 'axios';

export function getAxiosErrorCode(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error_code;
  }
  return 'UNKNOWN_ERROR';
}
