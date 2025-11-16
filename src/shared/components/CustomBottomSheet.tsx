import React, { ReactElement, useCallback } from 'react';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { theme } from '@/src/styles/theme';

interface CustomBottomSheetProps {
  children: ReactElement;
  ref: React.RefObject<BottomSheetModal | null>;
  onChange?: (index: number) => void;
}

const CustomBottomSheet = ({ children, ref, onChange }: CustomBottomSheetProps) => {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.6} pressBehavior="close" />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      onChange={onChange}
      backgroundStyle={bottomSheetModalStyle}
      handleIndicatorStyle={bottomSheetHandleStyle}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={bottomSheetViewStyle}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
};

const bottomSheetModalStyle = {
  backgroundColor: theme.colors.gray.darkGray_1,
} as const;

const bottomSheetHandleStyle = {
  backgroundColor: theme.colors.gray.gray_1,
} as const;

const bottomSheetViewStyle = { flex: 1, backgroundColor: theme.colors.gray.darkGray_1 } as const;

export default CustomBottomSheet;
