import axios from 'axios';
import { Config } from '@/src/shared/constants/config';

// 회원가입 API 호출
export async function postEmailSignUp(email: string, password: string) {
  try {
    const response = await axios.post(`${Config.SERVER_URL}/api/v1/member/signup`, {
      email,
      password,
      agreedToTerms: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}
