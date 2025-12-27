import { useCreateComment } from '@/hooks/mutations/useCreateComment';
import { getAxiosErrorCode } from '@/src/shared/utils/getAxiosErrorCode';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Keyboard, TextInput as RNTextInput } from 'react-native';
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
  const isSubmitting = useRef(false);

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
  const onCancelReplyToComment = useCallback(() => {
    // 대댓글 작성 중이 아니면 아무것도 하지 않음
    if (!replyToCommentId) return;
    setValue('');
    setReplyToCommentId(null);
    Keyboard.dismiss();
  }, [replyToCommentId]);

  // 댓글 제출 핸들러
  const handleSubmitComment = (value: string, anonymous: boolean) => {
    const text = value.trim();
    if (!text || !Number.isFinite(postId)) return;

    // 중복클릭 방지
    if (isSubmitting.current) return;

    isSubmitting.current = true;

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
          Toast.show({ type: 'success', text1: 'Comment posted' });
        },
        onError: (error) => {
          const errorCode = getAxiosErrorCode(error);
          const errorMessage =
            COMMUNITY_ERROR_MESSAGE[errorCode] || COMMON_ERROR_MESSAGE[errorCode] || 'Failed to post comment.';

          Toast.show({ type: 'error', text1: errorMessage });
        },
        onSettled: () => {
          // 성공, 실패 상관없이 제출 상태 해제
          isSubmitting.current = false;
        },
      },
    );
  };

  // 키보드 숨김 시 대댓글 작성 취소 처리
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (!replyToCommentId || isSubmitting.current) return;

      // 입력창에 내용이 없으면 바로 취소
      if (!value.trim()) {
        onCancelReplyToComment();
        return;
      }

      // 입력창에 내용이 있으면 취소 여부 묻기
      Alert.alert('Cancel Reply', 'Are you sure you want to cancel replying to this comment?', [
        { text: 'No', style: 'cancel', onPress: () => inputRef.current?.focus() },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => onCancelReplyToComment(),
        },
      ]);
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [replyToCommentId, value, onCancelReplyToComment]);

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
