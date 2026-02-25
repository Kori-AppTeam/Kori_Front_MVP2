import api from '@/api/axiosInstance';

export async function postLogout(): Promise<void> {
  await api.post('/api/v1/member/logout');
}
