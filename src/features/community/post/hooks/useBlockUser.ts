import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blockUser } from '../apis/post';

export const useBlockUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => blockUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post'] });
    },
    onError: (error) => {
      console.error('신고 실패:', error);
    },
  });
};
