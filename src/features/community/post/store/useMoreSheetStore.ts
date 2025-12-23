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
  showMoreSheet: (
    type: SheetType,
    postId: number,
    authorId: number,
    commentId?: number,
    commentContent?: string,
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

  showMoreSheet: (type: SheetType, postId: number, authorId: number, commentId?: number, commentContent?: string) => {
    if (!postId || !authorId) return;

    set(() => ({
      type: type,
      isMoreSheetVisible: true,
      selectedPostId: postId,
      selectedCommentId: commentId,
      commentContent: commentContent || null,
      authorId: authorId,
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
