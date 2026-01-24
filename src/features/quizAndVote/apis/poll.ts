import api from '@/api/axiosInstance';

// 오늘의 퀴즈/투표 조회
export const getTodayPoll = async (type: 'QUIZ' | 'VOTE') => {
  const res = await api.get(`/api/v2/poll/today`, {
    params: {
      type: type,
    },
  });
  return res.data.data;
};

// 퀴즈/투표 참여 결과 전송
export const postPoll = async (pollId: number, optionId: number) => {
  const res = await api.post(`/api/v2/poll/${pollId}/participate`, {
    optionId: optionId,
  });
  return res.data.data;
};
