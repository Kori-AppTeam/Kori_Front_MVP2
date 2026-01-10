import { useCallback, useState } from 'react';
import { useCustomBottomSheet } from '@/src/shared/hooks/useCustomBottomSheet';

/*--- 드롭다운 바텀시트 훅 ---*/
export function useDropdownBottomSheet() {
  const { bottomSheetRef, handleBottomSheetOpen, handleBottomSheetClose } = useCustomBottomSheet();
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

  // 드롭다운 핸들러 함수
  const handleDropdown = useCallback(() => {
    setIsPickerOpen((prev) => {
      if (!prev) {
        handleBottomSheetOpen();
      } else {
        handleBottomSheetClose();
      }

      return !prev;
    });
  }, [bottomSheetRef, handleBottomSheetClose, handleBottomSheetOpen]);

  return {
    bottomSheetRef,
    handleBottomSheetOpen,
    handleBottomSheetClose,
    isPickerOpen,
    setIsPickerOpen,
    handleDropdown,
  };
}
