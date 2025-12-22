import { create } from 'zustand';

// 게시글 더보기 시트 상태 관리 스토어
interface UseMoreSheetStore {
  isMoreSheetVisible: boolean;
  selectedPostId: number | null;
  authorId: number | null;
  showMoreSheet: (postId: number, authorId: number) => void;
  hideMoreSheet: () => void;
  resetData: () => void;
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
    set((state) => ({
      ...state,
      isMoreSheetVisible: false,
    })),
  resetData: () =>
    set(() => ({
      isMoreSheetVisible: false,
      selectedPostId: null,
      authorId: null,
    })),
}));
