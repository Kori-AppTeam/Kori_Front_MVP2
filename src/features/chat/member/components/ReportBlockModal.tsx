import React from 'react';
import styled from 'styled-components/native';
import { BottomSheetBase } from './BottomSheetBase';

interface ReportBlockModalProps {
  visible: boolean;
  targetUserName: string;
  onClose: () => void;
  onPressBlock: () => void;
  onPressReport: () => void;
}

/**
 * 신고/차단 선택 모달
 * BottomSheetBase를 활용한 첫 번째 단계 모달
 */
export const ReportBlockModal: React.FC<ReportBlockModalProps> = ({
  visible,
  targetUserName,
  onClose,
  onPressBlock,
  onPressReport,
}) => {
  return (
    <BottomSheetBase visible={visible} onClose={onClose}>
      <TargetUser>{targetUserName}</TargetUser>

      <MenuItem onPress={onPressReport}>
        <MenuText>Report</MenuText>
      </MenuItem>

      <MenuItem onPress={onPressBlock}>
        <MenuText style={{ color: '#FF4F4F' }}>Block</MenuText>
      </MenuItem>
    </BottomSheetBase>
  );
};

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
