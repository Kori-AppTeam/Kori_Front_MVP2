import api from '@/api/axiosInstance';

export const getTodayQuizAndVote = async (type: 'QUIZ' | 'VOTE') => {
  const res = await api.get(`/api/v1/today`, {
    params: { type },
  });
  return res.data;
};
