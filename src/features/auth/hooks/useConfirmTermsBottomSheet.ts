import { useEffect } from 'react';
import { useConfirmTermsBottomSheetStore } from '@/src/features/auth/store/useConfirmTermsBottomSheetStore';
import { useCustomBottomSheet } from '@/src/shared/hooks/useCustomBottomSheet';

export function useConfirmTermsBottomSheet() {
  const { bottomSheetRef, handleBottomSheetOpen, handleBottomSheetClose } = useCustomBottomSheet();
  const { reopen, clearReopen } = useConfirmTermsBottomSheetStore();

  // 약관 동의 바텀시트를 다시 열어야 하는 경우 바텀시트 열기
  // (ex. 약관 상세 페이지에서 다시 로그인 페이지로 돌아온 경우)
  useEffect(() => {
    if (reopen) {
      handleBottomSheetOpen();
      clearReopen();
    }
  }, [reopen]);

  return { bottomSheetRef, handleBottomSheetClose, handleBottomSheetOpen };
}
