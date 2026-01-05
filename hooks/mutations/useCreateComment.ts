import { createComment } from '@/src/features/community/post/apis/comments';
import { CreateCommentReq } from '@/src/features/community/post/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateComment(postId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: CreateCommentReq) => {
      const { anonymous, parentId, comment } = vars;
      if (!postId) throw new Error('postId required');
      return createComment(postId, { anonymous, parentId, comment });
    },
    onSuccess: () => {
      if (postId) {
        qc.invalidateQueries({ queryKey: ['post', postId] });
        qc.invalidateQueries({ queryKey: ['comments', 'post', postId] });
      }
    },
  });
}
