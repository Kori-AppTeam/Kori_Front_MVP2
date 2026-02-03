import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVotePost } from '../apis/write';
import { UpdateVotePostBody } from '../types';

export const useUpdateVotePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body }: { body: UpdateVotePostBody }) => updateVotePost(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post'] });
      queryClient.invalidateQueries({ queryKey: ['todayPoll', 'VOTE'] });
    },
  });
};
