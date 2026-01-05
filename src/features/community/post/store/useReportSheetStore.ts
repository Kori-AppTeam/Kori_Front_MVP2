import { create } from 'zustand';
import { AllowedCategory } from '../types';

type ReportTargetType = 'post' | 'comment' | 'user';

interface UseReportSheetStore {
  isReportSheetVisible: boolean;
  selectedId: number | null;
  selectedCategory?: AllowedCategory | null;
  selectedReportTarget: ReportTargetType | null;
  showReportSheet: (postId: number, reportTarget: ReportTargetType, category: AllowedCategory) => void;
  hideReportSheet: () => void;
  resetData: () => void;
}

export const useReportSheetStore = create<UseReportSheetStore>((set) => ({
  isReportSheetVisible: false,
  selectedId: null,
  selectedReportTarget: null,
  selectedCategory: null,

  showReportSheet: (postId: number, reportTarget: ReportTargetType, category: AllowedCategory) => {
    if (!postId) return;
    // 게시글 신고 시에는 카테고리 필수
    if (reportTarget === 'post') {
      if (!category) return;
    }

    set(() => ({
      isReportSheetVisible: true,
      selectedId: postId,
      selectedCategory: category,
      selectedReportTarget: reportTarget,
    }));
  },
  hideReportSheet: () =>
    set((state) => ({
      ...state,
      isReportSheetVisible: false,
    })),
  resetData: () =>
    set(() => ({
      isReportSheetVisible: false,
      selectedId: null,
      selectedCategory: null,
      selectedReportTarget: null,
    })),
}));
