import api from '@/api/axiosInstance';

type SupportLinksResponse = {
  feedbackUrl: string;
  bugReportUrl: string;
};

export const getSupportLinks = async (): Promise<SupportLinksResponse> => {
  const res = await api.get('/api/v1/mypage/support-links');
  return res.data;
};
