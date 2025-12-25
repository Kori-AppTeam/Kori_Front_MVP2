import { create } from 'zustand';

interface UseEditCommentSheetStore {
  isEditCommentSheetVisible: boolean;
  selectedCommentId: number | null;
  commentContent: string | null;
  showEditCommentSheet: (commentId: number, content: string) => void;
  hideEditCommentSheet: () => void;
  updateCommentContent: (content: string) => void;
  resetData: () => void;
}

export const useEditCommentSheetStore = create<UseEditCommentSheetStore>((set) => ({
  isEditCommentSheetVisible: false,
  selectedCommentId: null,
  commentContent: null,

  showEditCommentSheet: (commentId: number, content: string) => {
    if (!commentId) return;

    set(() => ({
      isEditCommentSheetVisible: true,
      selectedCommentId: commentId,
      commentContent: content,
    }));
  },
  hideEditCommentSheet: () =>
    set((state) => ({
      ...state,
      isEditCommentSheetVisible: false,
    })),
  updateCommentContent: (content: string) =>
    set((state) => ({
      ...state,
      commentContent: content,
    })),
  resetData: () =>
    set(() => ({
      isEditCommentSheetVisible: false,
      selectedCommentId: null,
      commentContent: null,
    })),
}));
