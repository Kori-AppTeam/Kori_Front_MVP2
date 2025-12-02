import api from '@/api/axiosInstance';

export type CheckVisitor = {
  userId: number;
  profileCompleted: boolean;
};

export async function getIsVisitor(): Promise<CheckVisitor> {
  const response = await api.get('/api/v1/member/is-completed');
  return response.data;
}
