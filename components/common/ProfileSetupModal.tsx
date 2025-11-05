import React from 'react';
import styled from 'styled-components/native';
import CustomButton from '../CustomButton';
import { Text, Modal } from 'react-native';
import Icon from './Icon';
import { router } from 'expo-router';

interface ProfileSetupModal {
  visible: boolean;
  onClose: () => void;
}

const ProfileSetupModal = ({ visible, onClose }: ProfileSetupModal) => {
  const handleGoToProfile = () => {
    onClose();
    router.push('/(tabs)/mypage/edit' as any);
  };
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <ModalBackground>
        <ModalArea>
          <IconContainer>
            <Icon type="notice1" size={24} />
          </IconContainer>
          <ModalTitle>
            <Text>Finish setting up your profile</Text>
          </ModalTitle>
          <ModalContent>
            <Text>{`Complete your profile on My Page\n to enjoy every feature Kori offers.`}</Text>
          </ModalContent>
          <CustomButton label="Go to Edit Page" tone="mint" filled={true} onPress={handleGoToProfile} />
        </ModalArea>
        <TextButton
          onPress={() => {
            onClose();
          }}
        >
          <Text>Maybe later</Text>
        </TextButton>
      </ModalBackground>
    </Modal>
  );
};

export default ProfileSetupModal;

const ModalBackground = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
`;

const ModalArea = styled.View`
  display: flex;
  flex-direction: column;
  width: 344px;
  height: 220px;
  border-radius: 8px;
  display: flex;
  padding: 20px;
  background-color: white;
`;

const ModalTitle = styled.Text`
  font-family: PlusJakartaSans_700Bold;
  font-weight: 700;
  font-size: 22px;
  text-align: center;
  color: #171818;
  padding-top: 12px;
  padding-bottom: 20px;
`;

const ModalContent = styled.Text`
  font-family: PlusJakartaSans_400Regular;
  font-size: 14px;
  text-align: center;
  color: #616262;
  padding-bottom: 24px;
`;

const TextButton = styled.Text`
  font-family: PlusJakartaSans_500Medium;
  font-size: 15px;
  color: #cccfd0;
  padding-top: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #cccfd0;
  padding-bottom: 1px;
`;

const IconContainer = styled.View`
  width: 100%;
  align-items: center;
`;
