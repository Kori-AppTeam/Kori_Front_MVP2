import axios from 'axios';

export function getAxiosErrorCode(error: unknown): string | undefined {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error_code;
  }
  return undefined;
}
