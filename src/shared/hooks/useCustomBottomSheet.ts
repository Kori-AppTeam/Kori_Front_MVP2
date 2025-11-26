import { useRef, useCallback } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export function useCustomBottomSheet() {
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);

  const handleBottomSheetOpen = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleBottomSheetClose = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  return { bottomSheetRef, handleBottomSheetOpen, handleBottomSheetClose };
}
