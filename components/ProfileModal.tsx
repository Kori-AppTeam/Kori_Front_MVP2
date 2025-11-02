import FriendCard from '@/components/FriendCard';
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
  const mapApiDataToFriendCardProps = (data: any) => {
    return {
      userId: data.userId,
      name: `${data.firstname} ${data.lastname}`,
      country: data.country,
      birth: data.birthday ? new Date(data.birthday).getFullYear() : undefined,
      gender: data.gender?.toLowerCase() as 'male' | 'female' | 'unspecified',
      purpose: data.purpose,
      languages: data.language || [],
      personalities: data.hobby || [],
      bio: data.introduction || 'No introduction',
      imageKey: data.imageKey,
    };
  };

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
              <FriendCard
                {...mapApiDataToFriendCardProps(userData)}
                followStatus={userData.followStatus}
                isLoadingFollow={isLoadingFollow}
                isLoadingChat={isLoadingChat}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                onChat={onChat || (() => console.log('chat start'))}
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
