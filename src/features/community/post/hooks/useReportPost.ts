import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportPost } from '../apis/post';
import { BlockReportPostParams } from '../types';

type ReportPostParams = {
  postId: number;
  reason: BlockReportPostParams;
};

export const useReportPost = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, reason }: ReportPostParams) => reportPost(postId, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post'] });
    },
    onError: (error) => {
      console.error('신고 실패:', error);
    },
  });
};
