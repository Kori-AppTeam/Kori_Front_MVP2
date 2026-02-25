import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { Keyboard, Platform } from 'react-native';

type BottomSheetRef = RefObject<BottomSheetModal | null>;

interface UseBottomSheetKeyboardControlOptions {
  /** 키보드가 내려갈 때 복구할 인덱스 (기본값: 0) */
  restoreIndex?: number;
  /** 키보드 hide 이후 복구를 지연할 시간(ms) (기본값: 80) */
  restoreDelayMs?: number;
  /** 키보드 hide 시 snap 복구를 수행할지 여부 (기본값: true) */
  enableRestoreOnHide?: boolean;
}

/**
 * 바텀시트가 내부 Input의 포커스/키보드와 함께 동작할 때,
 * - 키보드가 내려가도 바텀시트가 원래 위치로 복구되지 않는 문제
 * - 스와이프 닫기 중 키보드 이벤트와 충돌하는 문제
 * 를 안정적으로 처리하기 위한 커스텀 훅
 */

export function useBottomSheetKeyboardControl(
  bottomSheetRef: BottomSheetRef,
  options: UseBottomSheetKeyboardControlOptions = {},
) {
  const { restoreIndex = 0, restoreDelayMs = 80, enableRestoreOnHide = true } = options;

  // 현재 바텀시트 인덱스를 추적
  const sheetIndexRef = useRef(0);
  // 바텀시트가 닫히는 중인지(스와이프 dismiss 등) 추적
  const isClosingRef = useRef(false);
  // 키보드가 떠있는 상태인지 추적
  const keyboardVisibleRef = useRef(false);
  // 키보드를 먼저 닫고, 그 다음 바텀시트를 닫기 위한 플래그
  const pendingDismissRef = useRef(false);

  // BottomSheetModal의 onChange에 연결해 인덱스를 항상 최신으로 유지
  const onChange = useCallback((index: number) => {
    sheetIndexRef.current = index;
  }, []);

  // BottomSheetModal의 onAnimate에 연결해서 닫힘 상태를 추적
  const onAnimate = useCallback((_fromIndex: number, toIndex: number) => {
    isClosingRef.current = toIndex === -1;
  }, []);

  // 키보드가 떠 있으면 키보드를 먼저 내리고, 이후 바텀시트를 닫음
  const dismissAfterKeyboard = useCallback(() => {
    if (keyboardVisibleRef.current) {
      pendingDismissRef.current = true;
      Keyboard.dismiss();
      return;
    }

    bottomSheetRef.current?.dismiss();
  }, [bottomSheetRef]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    let restoreTimeout: ReturnType<typeof setTimeout> | null = null;

    const showSub = Keyboard.addListener(showEvent, () => {
      keyboardVisibleRef.current = true;
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      keyboardVisibleRef.current = false;

      // 키보드 → 바텀시트 순으로 닫아야 하는 경우
      if (pendingDismissRef.current) {
        pendingDismissRef.current = false;
        requestAnimationFrame(() => bottomSheetRef.current?.dismiss());
        return;
      }

      // 스와이프 dismiss와 충돌하지 않도록, 키보드 hide 직후 지연해서 복구
      if (!enableRestoreOnHide) return;
      if (restoreTimeout) clearTimeout(restoreTimeout);

      restoreTimeout = setTimeout(() => {
        // 닫히는 중이거나 이미 닫힌(-1) 상태면 복구하지 않음
        if (isClosingRef.current) return;
        if (sheetIndexRef.current === -1) return;
        // 이미 목표 인덱스면 스킵
        if (sheetIndexRef.current === restoreIndex) return;

        // out-of-range 에러 방지를 위해 restoreIndex 기본값을 0으로 유지
        bottomSheetRef.current?.snapToIndex(restoreIndex);
      }, restoreDelayMs);
    });

    return () => {
      if (restoreTimeout) clearTimeout(restoreTimeout);
      showSub.remove();
      hideSub.remove();
    };
  }, [bottomSheetRef, enableRestoreOnHide, restoreDelayMs, restoreIndex]);

  return {
    onChange,
    onAnimate,
    dismissAfterKeyboard,
  };
}
