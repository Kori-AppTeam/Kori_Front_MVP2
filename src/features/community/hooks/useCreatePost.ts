import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../apis/post';
import { CreatePostBody } from '../types';

export default function useCreatePost(boardId?: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreatePostBody) => {
      if (!boardId) throw new Error('boardId is required');
      return createPost(boardId, body);
    },
    onSuccess: () => {
      if (!boardId) return;
      qc.invalidateQueries({ queryKey: ['community-list', boardId] });
      qc.invalidateQueries({ queryKey: ['board', boardId, 'posts'] });
      qc.invalidateQueries({ queryKey: ['community-feed'] });
    },
  });
}
