import api from '@/api/axiosInstance';

export async function postFeedback(satisfied: string, content: string) {
  await api.post('/api/v1/feedbacks', {
    source: satisfied,
    content,
  });
}
