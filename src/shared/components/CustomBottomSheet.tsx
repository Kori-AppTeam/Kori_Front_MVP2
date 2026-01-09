import { theme } from '@/src/styles/theme';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { ReactElement, useCallback } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomBottomSheetProps {
  children: ReactElement;
  ref: React.RefObject<BottomSheetModal | null>;
  onChange?: (index: number) => void;
  backgroundColor?: string;
  handleComponent?: () => null;
}

const CustomBottomSheet = ({
  children,
  ref,
  onChange,
  backgroundColor = theme.colors.gray.darkGray_1,
  handleComponent = () => null,
}: CustomBottomSheetProps) => {
  const { bottom } = useSafeAreaInsets();
  const isAndroidButtonNav = Platform.OS === 'android' && bottom > 25;

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
  } as const;

  return (
    <BottomSheetModal
      ref={ref}
      onChange={onChange}
      backgroundStyle={bottomSheetModalStyle}
      handleIndicatorStyle={bottomSheetHandleStyle}
      backdropComponent={renderBackdrop}
      handleComponent={handleComponent}
    >
      <BottomSheetView style={bottomSheetViewStyle}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
};

export default CustomBottomSheet;
