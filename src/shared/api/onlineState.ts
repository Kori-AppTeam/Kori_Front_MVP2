import api from '@/api/axiosInstance';

type OnlineStateResponse = {
  lastSeenAt: string;
  online: boolean;
};

// 사용자 온라인 상태 조회
export const getOnlineState = async (userId: number): Promise<OnlineStateResponse> => {
  const response = await api.get(`/api/v1/member/profile/${userId}/online-status`);
  return response.data.data;
};
