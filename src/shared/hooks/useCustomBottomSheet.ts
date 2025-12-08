import { useRef, useCallback } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

/**
 * 커스텀 바텀시트 훅
 * - 바텀시트 모달을 열고 닫는 핸들러와 참조를 사용할 수 있습니다.
 * - 어떤 컴포넌트에서든 바텀시트를 쉽게 제어할 수 있도록 합니다.
 */

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
