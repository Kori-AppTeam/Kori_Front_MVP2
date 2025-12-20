import { Comment } from '../../post/types';

export interface CommentNode extends Comment {
  replies: CommentNode[];
}

// 댓글들을 트리구조로 변환
export const organizeComment = (comments: Comment[]): CommentNode[] => {
  const commentMap: Record<number, CommentNode> = {};
  const rootComments: CommentNode[] = [];

  comments.forEach((comment) => {
    commentMap[comment.commentId] = { ...comment, replies: [] } as CommentNode;
  });

  comments.forEach((comment) => {
    if (comment.parentCommentId) {
      const parent = commentMap[comment.parentCommentId];
      if (parent) {
        parent.replies.push(commentMap[comment.commentId]);
      }
    } else {
      rootComments.push(commentMap[comment.commentId]);
    }
  });

  return rootComments;
};
