import { COMMUNITY_ROUTER } from '@/src/shared/constants/route';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { InitialEditData } from '../../write/types';
import { PostDetail } from '../types';
import { useDeletePost } from './useMyPosts';

// 게시글 수정, 삭제 핸들러 함수
export const usePostActions = ({ onSuccessCallback }: { onSuccessCallback?: () => void }) => {
  const { mutate: deletePostMutation } = useDeletePost();

  // 게시글 삭제
  const onDeletePost = (postId: number) => {
    deletePostMutation(postId, {
      onSuccess: () => {
        // 커뮤니티 toast 디자인 수정 필요
        Toast.show({ type: 'success', text1: '1 Post deleted' });
      },
      onError: (error) => {
        console.error('[delete] error', error);
        Toast.show({ type: 'error', text1: 'Delete failed' });
      },
    });
  };

  // 게시글 삭제 핸들러
  const handleDeletePost = (postId: number) => {
    // 바텀시트 닫기
    if (onSuccessCallback) {
      onSuccessCallback();
    }

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
            onPress: () => onDeletePost(postId),
          },
        ],
        { cancelable: true },
      );
    }, 400);
  };

  // 게시글 수정 라우터 핸들러
  const handleRouterUpdatePost = (postId: number, postDetailData: PostDetail) => {
    //바텀시트 닫기
    if (onSuccessCallback) {
      onSuccessCallback();
    }

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
        postId: postId,
        initialData: JSON.stringify(editData),
      },
    });
  };

  return {
    handleDeletePost,
    handleRouterUpdatePost,
  };
};
