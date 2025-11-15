import { useRef, useCallback } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

export function useCustomBottomSheet() {
  const bottomSheetRef = useRef<BottomSheet | null>(null);

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return { bottomSheetRef, openBottomSheet, closeBottomSheet };
}
