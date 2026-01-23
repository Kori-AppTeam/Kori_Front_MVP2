import api from '@/api/axiosInstance';

export async function getProfileOptions() {
  const { data } = await api.get('/api/v1/member/profile-options');
  return data;
}
