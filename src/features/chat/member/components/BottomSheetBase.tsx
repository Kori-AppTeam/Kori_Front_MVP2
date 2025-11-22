import React from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';

interface BottomSheetBaseProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

/**
 * 공통 BottomSheet 컴포넌트
 * 모든 모달의 기본 구조 제공
 */
export const BottomSheetBase: React.FC<BottomSheetBaseProps> = ({ visible, onClose, children }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <ModalOverlay activeOpacity={1} onPress={onClose}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetHandle />
          </BottomSheetHeader>
          {children}
        </BottomSheetContent>
      </ModalOverlay>
    </Modal>
  );
};

const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const BottomSheetContent = styled.View`
  background-color: #353637;
  border-radius: 8px;
  padding-bottom: 40px;
`;

const BottomSheetHeader = styled.View`
  align-items: center;
  padding: 15px 20px 10px 20px;
`;

const BottomSheetHandle = styled.View`
  width: 45px;
  height: 6px;
  background-color: #949899;
  border-radius: 2px;
  margin-bottom: 16px;
`;
