import axios from 'axios';
import { Config } from '@/src/shared/constants/config';
import { AppLoginResponse } from '@/src/features/auth/types/api.types';

// 서버로 구글 로그인 토큰 전송
export async function postGoogleAppLogin(code: string) {
  try {
    const res = await axios.post<AppLoginResponse>(`${Config.SERVER_URL}/api/v1/member/google/app-login`, { code });
    return { ...res.data.data };
  } catch (error) {
    throw new Error('Google login request failed');
  }
}
