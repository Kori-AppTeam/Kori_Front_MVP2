import axios from 'axios';
import { Config } from '@/src/shared/constants/config';

export async function getAppVersion(platform: string, currentVersion: string) {
  const response = await axios.get(`${Config.SERVER_URL}/api/v1/app/version`, {
    params: { platform, currentVersion },
  });
  return response.data;
}
