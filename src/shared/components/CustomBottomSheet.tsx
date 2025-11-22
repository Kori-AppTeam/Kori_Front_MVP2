import React, { ReactElement, useCallback } from 'react';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { theme } from '@/src/styles/theme';

/**
 * 공용 커스텀 바텀시트 컴포넌트
 * - 바텀시트 모달의 스타일과 백드롭을 공통으로 설정하고, 내부에 children을 렌더링합니다.
 * - children에 원하는 형태의 컴포넌트를 넣어 사용할 수 있습니다.
 *
 * @param children 바텀시트 내부에 렌더링할 컴포넌트
 * @param ref 바텀시트 모달 참조
 * @param onChange 바텀시트 인덱스 변경 시 호출되는 콜백 함수
 */
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
