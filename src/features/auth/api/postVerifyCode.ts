import axios from 'axios';
import { Config } from '@/src/shared/constants/config';

// 이메일 인증 코드 검증
export async function postVerifyCode(email: string, verificationCode: string) {
  try {
    const response = await axios.post(`${Config.SERVER_URL}/api/v1/member/verify-code`, {
      email,
      verificationCode,
    });

    return response.data.data;
  } catch (error) {
    throw error;
  }
}
