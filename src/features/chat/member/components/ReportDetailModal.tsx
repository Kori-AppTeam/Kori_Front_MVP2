import React, { useState } from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';

interface ReportDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (details: string) => void;
}

/**
 * 신고 상세 내용 입력 모달
 * 독립적인 Modal 구조 (BottomSheetBase 미사용)
 */
export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ visible, onClose, onSubmit }) => {
  const [details, setDetails] = useState('');

  const handleSubmit = () => {
    onSubmit(details);
    setDetails(''); // 초기화
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <ModalOverlay activeOpacity={1} onPress={onClose}>
        <ModalContent onStartShouldSetResponder={() => true}>
          <ModalTitle>Provide Additional Details (Optional)</ModalTitle>

          <ModalSubTitle>Help us understand what's happening</ModalSubTitle>

          <TextInput
            multiline
            placeholder="Share additional details..."
            placeholderTextColor="#949899"
            value={details}
            onChangeText={setDetails}
            maxLength={500}
          />

          <CharCount>{details.length}/500</CharCount>

          <SubmitButton onPress={handleSubmit}>
            <SubmitButtonText>Submit Report</SubmitButtonText>
          </SubmitButton>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  background-color: #353637;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
`;

const ModalTitle = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-family: PlusJakartaSans_600SemiBold;
  margin-bottom: 8px;
`;

const ModalSubTitle = styled.Text`
  color: #949899;
  font-size: 14px;
  font-family: PlusJakartaSans_400Regular;
  margin-bottom: 16px;
`;

const TextInput = styled.TextInput`
  background-color: #2a2b2c;
  border-radius: 8px;
  padding: 12px;
  color: #ffffff;
  font-size: 15px;
  font-family: PlusJakartaSans_400Regular;
  min-height: 120px;
  text-align-vertical: top;
  margin-bottom: 8px;
`;

const CharCount = styled.Text`
  color: #949899;
  font-size: 12px;
  font-family: PlusJakartaSans_400Regular;
  text-align: right;
  margin-bottom: 16px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #ff4f4f;
  border-radius: 8px;
  padding: 14px;
  align-items: center;
`;

const SubmitButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-family: PlusJakartaSans_600SemiBold;
`;
