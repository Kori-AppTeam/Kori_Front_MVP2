import { Config } from '@/src/shared/constants/config';
import axios, { isAxiosError } from 'axios';
import { Alert } from 'react-native';

// 이미 가입된 이메일이 존재하는지 확인
export async function postEmailCheck(email: string) {
  try {
    Alert.alert('Debug', `API URL: ${Config.SERVER_URL}/api/v1/member/email/check`);
    const response = await axios.post(`${Config.SERVER_URL}/api/v1/member/email/check`, { email: email });
    const { exists } = response.data.data;
    return exists;
  } catch (error) {
    if (isAxiosError(error)) {
      Alert.alert('API ERROR', `${error.response?.data?.message || error.message}`);
    }

    throw error;
  }
}
