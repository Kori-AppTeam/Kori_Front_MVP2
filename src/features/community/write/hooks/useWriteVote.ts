import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVotePost } from '../apis/write';
import { CreateVotePostBody } from '../types';

export const useWriteVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateVotePostBody) => createVotePost(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
  });
};
