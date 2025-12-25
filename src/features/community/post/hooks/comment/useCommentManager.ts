import { useCreateComment } from '@/hooks/mutations/useCreateComment';
import { getAxiosErrorCode } from '@/src/shared/utils/getAxiosErrorCode';
import { useMemo, useRef, useState } from 'react';
import { Keyboard, TextInput as RNTextInput } from 'react-native';
import Toast from 'react-native-toast-message';
import { COMMON_ERROR_MESSAGE, COMMUNITY_ERROR_MESSAGE } from '../../../shared/constants/error';
import { Comment, SortParam } from '../../types';
import { CommentNode, organizeComment } from './../../../shared/utils/organizeComment';
import { useGetPostComments } from './useGetPostComments';
import { useToggleCommentLike } from './useToggleCommentLike';

// 상세게시글 댓글 작성 및 좋아요 관리 훅
export function useCommentManager(postId: number, sort: SortParam) {
  const { data } = useGetPostComments(Number.isFinite(postId) ? postId : undefined, sort);
  const createCommentMutation = useCreateComment(postId);
  const likeComment = useToggleCommentLike();
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [value, setValue] = useState('');
  const inputRef = useRef<RNTextInput | null>(null);

  // 대댓글 정렬 위해서 댓글들을 트리구조로 변환
  const organizedComments: CommentNode[] = useMemo(() => {
    if (!data) return [];
    const organized = data.pages.flatMap((page) => page.data.items);
    return organizeComment(organized);
  }, [data]);

  // 대댓글 작성
  const onClickReplyToComment = (commentId: number) => {
    setReplyToCommentId(commentId);
    inputRef.current?.focus();
  };

  // 대댓글 작성 취소
  const onCancelReplyToComment = () => {
    setReplyToCommentId(null);
    Keyboard.dismiss();
  };

  // 댓글 제출 핸들러
  const handleSubmitComment = (value: string, anonymous: boolean) => {
    const text = value.trim();
    if (!text || !Number.isFinite(postId)) return;
    createCommentMutation.mutate(
      {
        parentId: replyToCommentId ?? null,
        comment: text,
        anonymous: anonymous,
      },
      {
        onSuccess: () => {
          setReplyToCommentId(null);
          setValue('');
          Keyboard.dismiss();
        },
        onError: (error) => {
          const errorCode = getAxiosErrorCode(error);
          const errorMessage =
            COMMUNITY_ERROR_MESSAGE[errorCode] || COMMON_ERROR_MESSAGE[errorCode] || 'Failed to post comment.';

          Toast.show({ type: 'error', text1: errorMessage });
        },
      },
    );
  };

  // 댓글 좋아요 토글 핸들러
  const toggleCommentLike = (comment: Comment) => {
    const { commentId, isLiked } = comment;

    if (!Number.isFinite(commentId)) return;

    likeComment.mutate({ commentId, liked: isLiked });
  };

  return {
    organizedComments,
    handleSubmitComment,
    createCommentMutation,
    toggleCommentLike,
    onClickReplyToComment,
    onCancelReplyToComment,
    inputRef,
    replyToCommentId,
    value,
    setValue,
  };
}
