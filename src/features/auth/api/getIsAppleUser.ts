import api from '@/api/axiosInstance';
import { Config } from '@/src/shared/constants/config';

export async function getIsAppleUser(userId: string) {
  const res = await api.get(`${Config.SERVER_URL}/api/v1/member/${userId}/is-apple`);
  return res.data.data;
}
