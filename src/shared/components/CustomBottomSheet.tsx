import { theme } from '@/src/styles/theme';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { ReactElement, useCallback, useMemo } from 'react';
import { Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomBottomSheetProps {
  children: ReactElement;
  ref: React.RefObject<BottomSheetModal | null>;
  onChange?: (index: number) => void;
  onAnimate?: (fromIndex: number, toIndex: number) => void;
  backgroundColor?: string;
  handleComponent?: () => null;
  snapPoints?: BottomSheetModalProps['snapPoints'];
  enableDynamicSizing?: BottomSheetModalProps['enableDynamicSizing'];
  enableContentPanningGesture?: BottomSheetModalProps['enableContentPanningGesture'];
  keyboardBehavior?: BottomSheetModalProps['keyboardBehavior'];
  keyboardBlurBehavior?: BottomSheetModalProps['keyboardBlurBehavior'];
  android_keyboardInputMode?: BottomSheetModalProps['android_keyboardInputMode'];
  topInset?: number;
}

const CustomBottomSheet = ({
  children,
  ref,
  onChange,
  onAnimate,
  backgroundColor = theme.colors.gray.darkGray_1,
  handleComponent = () => null,
  snapPoints,
  enableDynamicSizing,
  enableContentPanningGesture,
  keyboardBehavior,
  keyboardBlurBehavior,
  android_keyboardInputMode,
  topInset,
}: CustomBottomSheetProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const isAndroidButtonNav = Platform.OS === 'android' && bottom > 25;

  const resolvedTopInset = useMemo(() => {
    if (typeof topInset === 'number') return topInset;
    if (keyboardBehavior !== 'interactive') return undefined;
    const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
    return Math.max(top, statusBarHeight);
  }, [keyboardBehavior, top, topInset]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.6} pressBehavior="close" />
    ),
    [],
  );

  const bottomSheetModalStyle = {
    backgroundColor: backgroundColor,
  } as const;

  const bottomSheetHandleStyle = {
    backgroundColor: backgroundColor,
  } as const;

  const bottomSheetViewStyle = {
    flex: 1,
    backgroundColor: backgroundColor,
    paddingBottom: isAndroidButtonNav ? bottom : 0,
    borderRadius: 22,
  } as const;

  return (
    <BottomSheetModal
      ref={ref}
      onChange={onChange}
      onAnimate={onAnimate}
      backgroundStyle={bottomSheetModalStyle}
      handleIndicatorStyle={bottomSheetHandleStyle}
      backdropComponent={renderBackdrop}
      handleComponent={handleComponent}
      snapPoints={snapPoints}
      enableDynamicSizing={enableDynamicSizing}
      enableContentPanningGesture={enableContentPanningGesture}
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior={keyboardBlurBehavior}
      android_keyboardInputMode={android_keyboardInputMode}
      topInset={resolvedTopInset}
    >
      <BottomSheetView style={bottomSheetViewStyle}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
};

export default CustomBottomSheet;
