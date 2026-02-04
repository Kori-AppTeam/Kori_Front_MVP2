import React from 'react';
import styled from 'styled-components/native';
import CustomButton from '@/src/shared/components/CustomButton';
import { Modal, useWindowDimensions } from 'react-native';
import Icon from './Icon';
import { router } from 'expo-router';
import { textStyle } from '@/src/styles/theme';
import { PROFILE_SETUP_ROUTE } from '@/src/shared/constants/route';

interface ProfileSetupModal {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ProfileSetupModal = ({
  visible,
  onClose,
  onConfirm,
  onCancel,
  confirmLabel = 'Go to Setup',
  cancelLabel = 'Maybe later',
}: ProfileSetupModal) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const modalWidth = Math.min(screenWidth * 0.9, 360);
  const modalMaxHeight = Math.min(screenHeight * 0.8, 520);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
      return;
    }

    onClose();
    router.replace(PROFILE_SETUP_ROUTE.BASIC_INFO);
  };
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <ModalBackground>
        <ModalArea style={{ width: modalWidth, maxHeight: modalMaxHeight }}>
          <ModalScroll showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
            <IconContainer>
              <Icon type="notice1" size={24} />
            </IconContainer>
            <ModalTitle>Finish setting up your profile</ModalTitle>
            <ModalContent>{`Complete your profile on Setup Page\n to enjoy Kori.`}</ModalContent>
          </ModalScroll>

          <ButtonArea>
            <CustomButton label={confirmLabel} tone="mint" filled={true} onPress={handleConfirm} />
          </ButtonArea>
        </ModalArea>

        <TextButton onPress={onCancel ?? onClose}>{cancelLabel}</TextButton>
      </ModalBackground>
    </Modal>
  );
};

export default ProfileSetupModal;

const ModalBackground = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.gray.overlay};
  padding: 24px 16px;
`;

const ModalArea = styled.View`
  flex-direction: column;
  border-radius: 8px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.primary.white};
`;

const ModalScroll = styled.ScrollView`
  width: 100%;
  flex-shrink: 1;
`;

const ButtonArea = styled.View`
  width: 100%;
  padding-top: 16px;
`;

const ModalTitle = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.headline.H4_SB)};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray.darkBlack_1};
  padding-top: 12px;
  padding-bottom: 12px;
`;

const ModalContent = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B4_R)};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray.darkGray_2};
  padding-bottom: 0px;
`;

const TextButton = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
  color: ${({ theme }) => theme.colors.gray.lightGray_1};
  margin-top: 14px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.gray.lightGray_1};
  padding-bottom: 1px;
`;

const IconContainer = styled.View`
  width: 100%;
  align-items: center;
`;
