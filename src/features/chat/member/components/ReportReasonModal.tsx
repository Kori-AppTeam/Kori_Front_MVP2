import React from 'react';
import styled from 'styled-components/native';
import type { ReportReason } from '../types';
import { BottomSheetBase } from './BottomSheetBase';

interface ReportReasonModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectReason: (reason: ReportReason) => void;
}

const REPORT_REASONS: Array<{ label: string; value: ReportReason }> = [
  { label: 'Spam', value: 'Spam' },
  { label: 'Sexual Activity', value: 'Sexual Activity' },
  { label: 'Violence', value: 'Violence' },
  { label: 'Fraud', value: 'Fraud' },
  { label: 'Etc', value: 'Etc' },
];

/**
 * 신고 사유 선택 모달
 * BottomSheetBase를 활용한 두 번째 단계 모달
 */
export const ReportReasonModal: React.FC<ReportReasonModalProps> = ({ visible, onClose, onSelectReason }) => {
  return (
    <BottomSheetBase visible={visible} onClose={onClose}>
      <ModalTitle>Why are you reporting this?</ModalTitle>

      {REPORT_REASONS.map(reason => (
        <MenuItem key={reason.value} onPress={() => onSelectReason(reason.value)}>
          <MenuText>{reason.label}</MenuText>
        </MenuItem>
      ))}
    </BottomSheetBase>
  );
};

const ModalTitle = styled.Text`
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
