import { COMMUNITY_ROUTER } from '@/src/shared/constants/route';
import { getAxiosErrorCode } from '@/src/shared/utils/getAxiosErrorCode';
import { router, usePathname } from 'expo-router';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { COMMON_ERROR_MESSAGE, POST_ERROR_MESSAGE } from '../../shared/constants/error';
import { InitialEditData } from '../../write/types';
import { useMoreSheetStore } from '../store/useMoreSheetStore';
import { useReportSheetStore } from '../store/useReportSheetStore';
import { BlockReportPostParams } from '../types';
import { useBlockUser } from './useBlockUser';
import { useGetPostDetail } from './useGetPostDetail';
import { useDeletePost } from './useMyPosts';
import { useReportPost } from './useReportPost';

// 게시글 수정, 삭제, 신고, 차단 핸들러 함수(바텀시트)
export const usePostActions = () => {
  const { mutate: deletePostMutation } = useDeletePost();
  const { mutate: reportPostMutation } = useReportPost();
  const { mutate: blockUserMutation } = useBlockUser();
  const { resetData: resetMoreSheetData, selectedPostId, authorId, hideMoreSheet } = useMoreSheetStore();
  const {
    showReportSheet,
    hideReportSheet,
    selectedId,
    resetData: resetReportSheetData,
    selectedCategory,
  } = useReportSheetStore();
  const { postDetailData } = useGetPostDetail(selectedPostId || undefined);

  const pathname = usePathname();
  // 게시글 삭제 핸들러
  const handleDeletePost = () => {
    if (!selectedPostId) return;
    console.log(selectedPostId);

    // 바텀시트 닫기
    hideMoreSheet();

    // 바텀시트 닫고 나서 Alert 띄우기
    setTimeout(() => {
      const title = 'Are you sure you want to delete that post?';
      Alert.alert(
        title,
        'After deleting it,\nyou cannot restore it.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deletePostMutation(selectedPostId, {
                onSuccess: () => {
                  // 커뮤니티 toast 디자인 수정 필요
                  Toast.show({ type: 'success', text1: '1 Post deleted' });
                  if (pathname === COMMUNITY_ROUTER.DETAIL[selectedPostId]) {
                    router.back();
                  }
                },
                onError: (error) => {
                  const errorCode = getAxiosErrorCode(error);
                  const errorMessage =
                    POST_ERROR_MESSAGE[errorCode] || COMMON_ERROR_MESSAGE[errorCode] || 'Delete failed';

                  Toast.show({ type: 'error', text1: errorMessage });
                },
                onSettled: () => resetMoreSheetData(),
              });
            },
          },
        ],
        { cancelable: true },
      );
    }, 400);
  };

  // 게시글 수정 라우터 핸들러
  const handleRouterUpdatePost = () => {
    if (!selectedPostId || !postDetailData) return;

    //바텀시트 닫기
    hideMoreSheet();

    const editData: InitialEditData = {
      boardCategory: postDetailData.boardCategory,
      content: postDetailData.content,
      contentImageUrls: postDetailData.contentImageUrls,
      isAnonymous: postDetailData.isAnonymous,
    };

    router.push({
      pathname: COMMUNITY_ROUTER.WRITE,
      params: {
        mode: 'edit',
        postId: selectedPostId,
        initialData: JSON.stringify(editData),
      },
    });
  };

  // 게시글 신고 핸들러
  const handleReportPost = () => {
    if (!selectedPostId || !postDetailData.boardCategory) return;

    // 바텀시트 닫기
    hideMoreSheet();

    // 신고 이유 작성 모달 열기
    setTimeout(() => showReportSheet(selectedPostId, 'post', postDetailData.boardCategory), 400);
  };

  // 게시글 신고 제출
  const submitReportPost = (reason: BlockReportPostParams, afterSuccess?: () => void) => {
    if (!selectedId || !selectedCategory) return;

    hideReportSheet();

    // 약간의 딜레이 후 Alert 표시
    setTimeout(() => {
      Alert.alert(
        'Report Post',
        'Are you sure you want to report this post?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Report',
            style: 'destructive',
            onPress: () => {
              // 신고 뮤테이션
              reportPostMutation(
                { postId: selectedId, reason },
                {
                  onSuccess: () => {
                    Toast.show({ type: 'success', text1: 'Reported successfully' });

                    if (afterSuccess) {
                      afterSuccess();
                    }
                  },
                  onError: (error) => {
                    const errorCode = getAxiosErrorCode(error);
                    const errorMessage =
                      POST_ERROR_MESSAGE[errorCode] || COMMON_ERROR_MESSAGE[errorCode] || 'Report failed';

                    Toast.show({ type: 'error', text1: errorMessage });
                  },
                  onSettled: () => resetReportSheetData(),
                },
              );
            },
          },
        ],
        { cancelable: true },
      );
    }, 300);
  };

  // 게시글 작성 유저 차단 핸들러
  const handleBlockUser = (afterSuccess?: () => void) => {
    if (!authorId) return;

    // 바텀시트 닫기
    hideMoreSheet();

    setTimeout(() => {
      Alert.alert(
        'Block User',
        'Are you sure you want to block this user? \nYou will no longer see posts or comments from this user.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Block',
            style: 'destructive',
            onPress: () => {
              blockUserMutation(authorId, {
                onSuccess: () => {
                  Toast.show({ type: 'success', text1: 'User blocked successfully' });

                  if (afterSuccess) {
                    afterSuccess();
                  }
                },
                onError: (error) => {
                  console.error('[block user] error', error);
                  Toast.show({ type: 'error', text1: 'User block failed' });
                },
                onSettled: () => resetMoreSheetData(),
              });
            },
          },
        ],
        { cancelable: true },
      );
    }, 400);
  };

  return {
    handleDeletePost,
    handleRouterUpdatePost,
    handleReportPost,
    handleBlockUser,
    submitReportPost,
  };
};
