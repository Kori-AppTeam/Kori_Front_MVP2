import { useToggleBookmark } from './useToggleBookmark';
import { useToggleLike } from './useToggleLike';

// 좋아요 및 북마크 토글 훅
export const useHandleLikeBookmark = () => {
  const likeMutation = useToggleLike();
  const bookmarkMutation = useToggleBookmark();

  const handleToggleLike = (postId: number, isLike: boolean) => {
    likeMutation.mutate({ postId: postId, liked: isLike });
  };

  const handleToggleBookmark = (postId: number, isBookmark: boolean) => {
    bookmarkMutation.mutate({ postId: postId, isBookmarked: isBookmark });
  };

  return { handleToggleLike, handleToggleBookmark };
};
