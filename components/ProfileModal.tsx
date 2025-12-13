import UserProfileCard from '@/src/shared/components/UserProfileCard';
import React from 'react';
import { ActivityIndicator, Modal, ScrollView } from 'react-native';
import styled from 'styled-components/native';

type ProfileModalProps = {
  visible: boolean;
  userData: any;
  onClose: () => void;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onChat?: () => void;
  isLoadingFollow?: boolean;
  isLoadingChat?: boolean;
};

const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  userData,
  onClose,
  onFollow,
  onUnfollow,
  onChat,
  isLoadingFollow,
  isLoadingChat,
}) => {
  const handleFollow = () => {
    if (onFollow) onFollow();
  };

  const handleUnfollow = () => {
    if (onUnfollow) onUnfollow();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      {userData && (
        <Backdrop onPress={onClose} activeOpacity={1}>
          <ModalContainer onStartShouldSetResponder={() => true}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <UserProfileCard
                user={userData}
                defaultExpanded={true}
                actions={{
                  ...(userData.followStatus === 'FOLLOWING'
                    ? { decline: { label: 'Unfollow', onPress: handleUnfollow } }
                    : userData.followStatus === 'PENDING'
                      ? { secondary: { label: 'Pending', onPress: () => {} } }
                      : { primary: { label: 'Follow', onPress: handleFollow } }),
                  chat: { label: 'Chat', onPress: onChat || (() => {}) },
                }}
              />
            </ScrollView>

            {(isLoadingFollow || isLoadingChat) && (
              <LoadingOverlay>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </LoadingOverlay>
            )}
          </ModalContainer>
        </Backdrop>
      )}
    </Modal>
  );
};

export default ProfileModal;

const Backdrop = styled.TouchableOpacity`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.gray.overlay};
  justify-content: center;
  align-items: center;
`;

// friendCard보다 넓은 background 영역 투명하게 처리
const ModalContainer = styled.View`
  width: 100%;
  /* background-color: #fff; */
  border-radius: 20px;
  max-height: 90%;
  overflow: hidden;
`;

const LoadingOverlay = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;
