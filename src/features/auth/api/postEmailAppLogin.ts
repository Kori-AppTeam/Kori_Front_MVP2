import axios from 'axios';
import { Config } from '@/src/shared/constants/config';
import { EmailLoginResponse } from '@/src/features/auth/types';

export async function postEmailAppLogin(email: string, password: string) {
  try {
    const response = await axios.post<EmailLoginResponse>(`${Config.SERVER_URL}/api/v1/member/doLogin`, {
      email: email.trim(),
      password: password.trim(),
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}
