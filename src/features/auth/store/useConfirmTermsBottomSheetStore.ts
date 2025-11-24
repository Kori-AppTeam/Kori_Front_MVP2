import { create } from 'zustand';

interface ConfirmBottomSheetState {
  reopen: boolean;
  setReopen: () => void;
  clearReopen: () => void;
}

/* --------- 약관 동의 바텀사트 열림/닫힘 전역 상태 --------- */

// 약관 동의 바텀시트에서 약관 상세 페이지, 개인정보 정책 상세 페이지로 이동한 경우,
// 이전 페이지로 돌아왔을 때 약관 동의 바텀시트를 다시 보여주기 위한 전역 상태입니다.

export const useConfirmTermsBottomSheetStore = create<ConfirmBottomSheetState>((set) => ({
  reopen: false,
  setReopen: () => set({ reopen: true }),
  clearReopen: () => set({ reopen: false }),
}));
