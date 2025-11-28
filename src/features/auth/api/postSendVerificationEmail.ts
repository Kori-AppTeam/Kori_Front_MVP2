import { Config } from '@/src/shared/constants/config';
import axios from 'axios';

// 이메일 인증 코드 발송
export async function postSendVerificationEmail(email: string) {
  try {
    const response = await axios.post(`${Config.SERVER_URL}/api/v1/member/send-verification-email`, {
      email: email,
      lang: 'en',
    });
  } catch (error) {
    throw error;
  }
}
