import React, { ReactElement } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

interface CustomBottomSheetProps {
  children: ReactElement;
  ref: React.RefObject<BottomSheet | null>;
  onChange?: (index: number) => void;
}

const CustomBottomSheet = ({ children, ref, onChange }: CustomBottomSheetProps) => {
  return (
    <CustomGestureHandlerRootView>
      <BottomSheet ref={ref} onChange={onChange}>
        <CustomBottomSheetView>{children}</CustomBottomSheetView>
      </BottomSheet>
    </CustomGestureHandlerRootView>
  );
};

const CustomGestureHandlerRootView = styled(GestureHandlerRootView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary.white};
`;

const CustomBottomSheetView = styled(BottomSheetView)`
  flex: 1;
  padding: 36;
  align-items: center;
`;

export default CustomBottomSheet;
