import { create } from 'zustand';

type SheetType = 'post' | 'comment' | null;

// 게시글 더보기 시트 상태 관리 스토어
interface UseMoreSheetStore {
  type: SheetType;
  isMoreSheetVisible: boolean;
  selectedPostId: number | null;
  selectedCommentId: number | null;
  commentContent: string | null;
  authorId: number | null;
  hasReplies: boolean;
  showPostMoreSheet: (postId: number, authorId: number) => void;
  showCommentMoreSheet: (
    postId: number,
    authorId: number,
    commentId: number,
    content: string,
    hasReplies: boolean,
  ) => void;
  hideMoreSheet: () => void;
  resetData: () => void;
}

export const useMoreSheetStore = create<UseMoreSheetStore>((set) => ({
  isMoreSheetVisible: false,
  selectedPostId: null,
  selectedCommentId: null,
  commentContent: null,
  authorId: null,
  type: null,
  hasReplies: false,

  showPostMoreSheet: (postId: number, authorId: number) => {
    if (!postId || !authorId) return;

    set(() => ({
      type: 'post',
      isMoreSheetVisible: true,
      selectedPostId: postId,
      selectedCommentId: null,
      commentContent: null,
      authorId: authorId,
      hasReplies: false,
    }));
  },

  showCommentMoreSheet: (postId: number, authorId: number, commentId: number, content: string, hasReplies: boolean) => {
    if (!postId || !authorId || !commentId) return;

    set(() => ({
      type: 'comment',
      isMoreSheetVisible: true,
      selectedPostId: postId,
      selectedCommentId: commentId,
      commentContent: content,
      authorId: authorId,
      hasReplies: hasReplies,
    }));
  },
  hideMoreSheet: () =>
    set((state) => ({
      ...state,
      isMoreSheetVisible: false,
    })),
  resetData: () =>
    set(() => ({
      isMoreSheetVisible: false,
      selectedPostId: null,
      selectedCommentId: null,
      commentContent: null,
      authorId: null,
      type: null,
    })),
}));
