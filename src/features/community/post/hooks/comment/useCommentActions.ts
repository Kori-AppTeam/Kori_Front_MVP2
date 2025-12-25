import { COMMUNITY_ROUTER } from '@/src/shared/constants/route';
import { getAxiosErrorCode } from '@/src/shared/utils/getAxiosErrorCode';
import { usePathname, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { COMMON_ERROR_MESSAGE, COMMUNITY_ERROR_MESSAGE } from '../../../shared/constants/error';
import { useEditCommentSheetStore } from '../../store/useEditCommentSheetStore';
import { useMoreSheetStore } from '../../store/useMoreSheetStore';
import { useBlockComment } from './useBlockComment';
import { useDeleteComment } from './useDeleteComment';
import { useUpdateComment } from './useUpdateComment';

// 댓글 수정, 삭제, 차단 핸들러 함수 (바텀시트)
export const useCommentActions = () => {
  const router = useRouter();
  const pathname = usePathname();
  const deleteCommentMutation = useDeleteComment();
  const blockCommentMutation = useBlockComment();
  const updateCommentMutation = useUpdateComment();
  const { hideMoreSheet, selectedCommentId, selectedPostId, resetData: resetMoreSheetData } = useMoreSheetStore();
  const {
    showEditCommentSheet,
    hideEditCommentSheet,
    selectedCommentId: editCommentId,
    resetData: resetEditCommentSheetData,
  } = useEditCommentSheetStore();

  // 댓글 삭제 핸들러
  const handleDeleteComment = () => {
    if (!selectedCommentId) return;

    hideMoreSheet();

    setTimeout(() => {
      Alert.alert(
        'Delete Comment',
        'Are you sure you want to delete this comment?\nAfter deleting it, you cannot restore it.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteCommentMutation.mutate(selectedCommentId, {
                onSuccess: () => {
                  Toast.show({ type: 'success', text1: 'Comment deleted' });
                },
                onError: (error) => {
                  const errorCode = getAxiosErrorCode(error);
                  const errorMessage =
                    COMMUNITY_ERROR_MESSAGE[errorCode] || COMMON_ERROR_MESSAGE[errorCode] || 'Delete failed';

                  Toast.show({ type: 'error', text1: errorMessage });
                },
                onSettled: () => {
                  resetMoreSheetData();
                },
              });
            },
          },
        ],
        { cancelable: true },
      );
    }, 400);
  };

  // 댓글 차단 핸들러
  const handleBlockComment = () => {
    if (!selectedCommentId) return;

    hideMoreSheet();

    setTimeout(() => {
      Alert.alert(
        'Block Comment',
        'Are you sure you want to block this comment?\nYou will no longer see this comment.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Block',
            style: 'destructive',
            onPress: () => {
              blockCommentMutation.mutate(selectedCommentId, {
                onSuccess: () => {
                  Toast.show({ type: 'success', text1: 'Comment blocked' });
                },
                onError: (error) => {
                  const errorCode = getAxiosErrorCode(error);
                  const errorMessage =
                    COMMUNITY_ERROR_MESSAGE[errorCode] || COMMON_ERROR_MESSAGE[errorCode] || 'Block failed';

                  Toast.show({ type: 'error', text1: errorMessage });
                },
                onSettled: () => {
                  resetMoreSheetData();
                },
              });
            },
          },
        ],
        { cancelable: true },
      );
    }, 400);
  };

  // 댓글 수정 핸들러 (모달 열기)
  const handleEditComment = (content: string) => {
    if (!selectedCommentId) {
      return;
    }

    const isMyHistoryPage = pathname.startsWith('/community/my-history');

    // 바텀시트 닫기
    hideMoreSheet();

    // 마이히스토리 페이지에서 댓글 수정 시 상세페이지로 이동
    if (isMyHistoryPage && selectedPostId) {
      setTimeout(() => {
        router.push(COMMUNITY_ROUTER.DETAIL(selectedPostId));
        // 페이지 이동 후 수정 모달 열기
        setTimeout(() => {
          showEditCommentSheet(selectedCommentId, content);
        }, 500);
      }, 400);
    } else {
      // 상세페이지에서는 바로 수정 모달 열기
      setTimeout(() => {
        showEditCommentSheet(selectedCommentId, content);
      }, 400);
    }
  };

  // 댓글 수정 저장
  const submitEditComment = (content: string, onSuccessCallback?: () => void) => {
    if (!editCommentId || !content) return;

    const text = content.trim();
    if (!text) return;

    hideEditCommentSheet();

    // 약간의 딜레이 후 mutation 실행
    setTimeout(() => {
      updateCommentMutation.mutate(
        { commentId: editCommentId, content: text },
        {
          onSuccess: () => {
            Toast.show({ type: 'success', text1: 'Comment updated' });
            onSuccessCallback?.();
          },
          onError: (error) => {
            const errorCode = getAxiosErrorCode(error);
            const errorMessage =
              COMMUNITY_ERROR_MESSAGE[errorCode] || COMMON_ERROR_MESSAGE[errorCode] || 'Update failed';

            Toast.show({ type: 'error', text1: errorMessage });
          },
          onSettled: () => {
            resetEditCommentSheetData();
          },
        },
      );
    }, 300);
  };

  return {
    handleDeleteComment,
    handleBlockComment,
    handleEditComment,
    submitEditComment,
  };
};
