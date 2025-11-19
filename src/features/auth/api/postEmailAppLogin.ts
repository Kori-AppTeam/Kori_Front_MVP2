import axios from 'axios';
import { Config } from '@/src/shared/constants/config';
import { AppLoginResponse } from '@/src/features/auth/types/api.types';

export async function postEmailAppLogin(email: string, password: string) {
  try {
    const response = await axios.post<AppLoginResponse>(`${Config.SERVER_URL}/api/v1/member/doLogin`, {
      email: email.trim(),
      password: password.trim(),
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
