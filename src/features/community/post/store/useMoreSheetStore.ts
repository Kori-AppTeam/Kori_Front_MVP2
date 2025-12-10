import { create } from 'zustand';

interface UseMoreSheetStore {
  isMoreSheetVisible: boolean;
  selectedPostId: number | null;
  authorId: number | null;
  showMoreSheet: (postId: number, authorId: number) => void;
  hideMoreSheet: () => void;
}

export const useMoreSheetStore = create<UseMoreSheetStore>((set) => ({
  isMoreSheetVisible: false,
  selectedPostId: null,
  authorId: null,

  showMoreSheet: (postId: number, authorId: number) => {
    if (!postId || !authorId) return;

    set(() => ({
      isMoreSheetVisible: true,
      selectedPostId: postId,
      authorId: authorId,
    }));
  },
  hideMoreSheet: () =>
    set(() => ({
      isMoreSheetVisible: false,
      selectedPostId: null,
      authorId: null,
    })),
}));
