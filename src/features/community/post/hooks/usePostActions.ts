import { COMMUNITY_ROUTER } from '@/src/shared/constants/route';
import { getAxiosErrorCode } from '@/src/shared/utils/getAxiosErrorCode';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { COMMON_ERROR_MESSAGE, COMMUNITY_ERROR_MESSAGE } from '../../shared/constants/error';
import { InitialEditData, InitialVoteEditData } from '../../write/types';
import { useMoreSheetStore } from '../store/useMoreSheetStore';
import { useReportSheetStore } from '../store/useReportSheetStore';
import { BlockReportPostParams, GeneralPostDetail } from '../types';
import { isPostType } from '../utils/postUtils';
import { useBlockUser } from './useBlockUser';
import { useDeletePost } from './useDeletePost';
import { useGetPostDetail } from './useGetPostDetail';
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

  // 게시글 삭제 핸들러
  const handleDeletePost = (onSuccessCallback?: () => void) => {
    if (!selectedPostId) return;

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
                  Toast.show({ type: 'success', text1: '1 Post deleted' });
                  onSuccessCallback?.();
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

  // 게시글 수정 라우터 핸들러
  const handleRouterUpdatePost = () => {
    if (!selectedPostId || !postDetailData) return;

    //바텀시트 닫기
    hideMoreSheet();

    // 투표 글 수정 페이지로 이동
    if (isPostType(postDetailData)) {
      const editData: InitialVoteEditData = {
        id: selectedPostId,
        title: postDetailData.pollInfo.title,
        description: postDetailData.pollInfo.description,
        content: postDetailData.content,
        isAnonymous: postDetailData.isAnonymous,
        options: postDetailData.pollInfo.options.map((option) => option.content),
      };

      return router.push({
        pathname: COMMUNITY_ROUTER.VOTE_WRITE,
        params: {
          mode: 'edit',
          postId: selectedPostId,
          initialData: JSON.stringify(editData),
        },
      });
    }

    // 일반 글 수정 페이지로 이동
    const editData: InitialEditData = {
      boardCategory: postDetailData.boardCategory,
      content: postDetailData.content,
      contentImageUrls: (postDetailData as GeneralPostDetail).postInfo.contentImageUrl ?? [],
      isAnonymous: postDetailData.isAnonymous,
    };

    return router.push({
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
  const submitReportPost = (reason: BlockReportPostParams, onSuccessCallback?: () => void) => {
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
                    onSuccessCallback?.();
                  },
                  onError: (error) => {
                    const errorCode = getAxiosErrorCode(error);
                    const errorMessage =
                      COMMUNITY_ERROR_MESSAGE[errorCode] || COMMON_ERROR_MESSAGE[errorCode] || 'Report failed';

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
  const handleBlockUser = (onSuccessCallback?: () => void) => {
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
                  onSuccessCallback?.();
                },
                onError: (error) => {
                  const errorCode = getAxiosErrorCode(error);
                  const errorMessage =
                    COMMUNITY_ERROR_MESSAGE[errorCode] || COMMON_ERROR_MESSAGE[errorCode] || 'Report failed';

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

  return {
    handleDeletePost,
    handleRouterUpdatePost,
    handleReportPost,
    handleBlockUser,
    submitReportPost,
  };
};
