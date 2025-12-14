import CustomBottomSheet from '@/src/shared/components/CustomBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React from 'react';
import styled from 'styled-components/native';

interface ReportBlockModalProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  targetUserName: string;
  onPressBlock: () => void;
  onPressReport: () => void;
}

/**
 * 신고/차단 선택 모달
 * CustomBottomSheet를 활용한 첫 번째 단계 모달
 */
export const ReportBlockModal: React.FC<ReportBlockModalProps> = ({
  bottomSheetRef,
  targetUserName,
  onPressBlock,
  onPressReport,
}) => {
  return (
    <CustomBottomSheet ref={bottomSheetRef}>
      <Container>
        <TargetUser>{targetUserName}</TargetUser>

        <MenuItem onPress={onPressReport}>
          <MenuText>Report</MenuText>
        </MenuItem>

        <MenuItem onPress={onPressBlock}>
          <MenuText style={{ color: '#FF4F4F' }}>Block</MenuText>
        </MenuItem>
      </Container>
    </CustomBottomSheet>
  );
};

const Container = styled.View`
  padding: 20px 0px 40px 0px;
`;

const TargetUser = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-family: PlusJakartaSans_600SemiBold;
  margin: 0px 20px 16px 20px;
`;

const MenuItem = styled.TouchableOpacity`
  padding: 16px 20px;
  border-bottom-width: 0.5px;
  border-bottom-color: #949899;
`;

const MenuText = styled.Text`
  color: #ffffff;
  font-size: 15px;
  font-family: PlusJakartaSans_500Medium;
`;
