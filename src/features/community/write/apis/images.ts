import api from '@/api/axiosInstance';
import { PresignRequest, PresignedUrlItem } from '../../post/types';

export type PresignResponse = {
  message: string;
  data: PresignedUrlItem[];
  timestamp: string;
};

export const getPresignedUrls = async (body: PresignRequest): Promise<PresignedUrlItem[]> => {
  const res = await api.post<PresignResponse>('/api/v1/images/presign', body);
  return res.data.data;
};
