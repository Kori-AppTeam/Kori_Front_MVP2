import { useCreateOneToOneRoom } from '@/src/features/chat/room/hooks/useCreateOneToOneRoom';
import UserProfileCard from '@/src/shared/components/UserProfileCard';
import {
  useCancelFollowUserMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from '@/src/shared/hooks/useFollowQuery';
import React from 'react';
import { ActivityIndicator, Modal, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { User } from '../types/user';

type ProfileModalProps = {
  visible: boolean;
  userData: User | undefined | null;
  onClose: () => void;
  isLoadingFollow?: boolean;
  isLoadingChat?: boolean;
  routeType?: 'push' | 'replace';
  dissMissCount?: number;
};

const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  userData,
  onClose,
  isLoadingFollow,
  isLoadingChat,
  routeType = 'push',
  dissMissCount,
}) => {
  const followUserMutation = useFollowUserMutation();
  const unfollowUserMutation = useUnfollowUserMutation();
  const cancelFollowUserMutation = useCancelFollowUserMutation();
  const createChatRoom = useCreateOneToOneRoom();

  const handleFollow = () => {
    if (!userData) return;
    followUserMutation.mutate(userData.userId);
  };

  const handleUnfollow = () => {
    if (!userData) return;
    unfollowUserMutation.mutate(userData.userId);
  };

  const handleCancelFollow = () => {
    if (!userData) return;
    cancelFollowUserMutation.mutate(userData.userId);
  };

  const handleChat = () => {
    if (!userData) return;
    createChatRoom.mutate({
      otherUserId: userData.userId,
      userName: `${userData.firstname} ${userData.lastname}`,
      routeType: routeType,
      dissMissCount: dissMissCount,
      closeProfile: onClose,
    });
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
                  ...(userData.followStatus === 'FOLLOWED'
                    ? { decline: { label: 'Unfollow', onPress: handleUnfollow } }
                    : userData.followStatus === 'FOLLOWING'
                      ? { secondary: { label: 'Pending', onPress: handleCancelFollow } }
                      : { primary: { label: 'Follow', onPress: handleFollow } }),
                  chat: { label: 'Chat', onPress: handleChat },
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
