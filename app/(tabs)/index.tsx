import ProfileSetupModal from '@/components/common/ProfileSetupModal';
import { useCreateOneToOneRoom } from '@/src/features/chat/room/hooks/useCreateOneToOneRoom';
import { useRequestFeedback } from '@/src/features/feedback/hooks/useRequestFeedback';
import { FindHeader } from '@/src/features/find/components/FindHeader';
import { LinkedSpaceRecommendModal } from '@/src/features/find/components/LinkedSpaceRecommendModal';
import { useLinkedSpaceRecommendModal } from '@/src/features/find/hooks/useLinkedSpaceRecommendModal';
import { useRecommendedFriends } from '@/src/features/find/hooks/useRecommendedFriends';
import UserProfileCard from '@/src/shared/components/UserProfileCard';
import { useCancelFollowUserMutation, useFollowUserMutation } from '@/src/shared/hooks/useUserProfileQuery';
import { Text } from '@react-navigation/elements';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, FlatList, RefreshControl } from 'react-native';
import styled from 'styled-components/native';

export default function index() {
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const queryClient = useQueryClient();

  // Data fetching with filtering
  const { data: friends, isLoading, isFetching, refetch } = useRecommendedFriends(20);

  const createChatRoom = useCreateOneToOneRoom();
  const followMutation = useFollowUserMutation();
  const cancelFollowMutation = useCancelFollowUserMutation();

  const {
    visible: recommendVisible,
    profileModalVisible: recommendProfileModal,
    setProfileModalVisible: setRecommendProfileModal,
    handleJoin,
    handleDontShowToday,
    handleClose: handleRecommendClose,
  } = useLinkedSpaceRecommendModal();

  const handleFollowPress = (userId: number) => {
    followMutation.mutate(userId);

    // Update React Query cache to reflect PENDING status
    queryClient.setQueryData(['find', 'recommend', 20], (oldData: typeof friends) => {
      if (!oldData) return oldData;
      return oldData.map((friend) => (friend.userId === userId ? { ...friend, followStatus: 'PENDING' } : friend));
    });
  };

  // Define card actions based on follow status
  const getCardActions = (item: NonNullable<typeof friends>[0]) => {
    return {
      ...(item.followStatus === 'PENDING' || item.followStatus === 'FOLLOWING'
        ? {
            secondary: {
              label: 'Following',
              onPress: () => cancelFollowMutation.mutate(item.userId),
            },
          }
        : {
            primary: {
              label: 'Follow',
              onPress: () => handleFollowPress(item.userId),
            },
          }),
      chat: {
        label: 'Chat',
        onPress: () =>
          createChatRoom.mutate({
            otherUserId: item.userId,
            userName: `${item.firstname} ${item.lastname}`,
            routeType: 'push',
          }),
      },
    };
  };

  useRequestFeedback();

  // Scroll to top when FIND_TAB_PRESSED event is emitted
  // FIND_TAB_PRESSED is emitted from app/(tabs)/_layout.tsx
  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('FIND_TAB_PRESSED', () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    });

    return () => listener.remove();
  }, []);

  const onRefresh = () => {
    refetch();
  };

  return (
    <Safe>
      <FindHeader />

      {isLoading ? (
        <LoaderWrap>
          <ActivityIndicator />
        </LoaderWrap>
      ) : (
        <FlatList
          ref={flatListRef}
          data={friends}
          keyExtractor={(item) => String(item.userId)}
          refreshControl={<RefreshControl refreshing={Boolean(isFetching && !isLoading)} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <CardWrap>
              <UserProfileCard user={item} collapsible={true} actions={getCardActions(item)} />
            </CardWrap>
          )}
          ListEmptyComponent={
            <EmptyWrap>
              <EmptyText>
                <Text>No recommendations yet.</Text>
              </EmptyText>
            </EmptyWrap>
          }
        />
      )}

      <LinkedSpaceRecommendModal
        visible={recommendVisible}
        onJoin={handleJoin}
        onDontShowToday={handleDontShowToday}
        onClose={handleRecommendClose}
      />

      <ProfileSetupModal
        visible={profileModalVisible || recommendProfileModal}
        onClose={() => {
          setProfileModalVisible(false);
          setRecommendProfileModal(false);
        }}
      />
    </Safe>
  );
}

const Safe = styled.SafeAreaView`
  flex: 1;
  background-color: #1d1e1f;
`;

const LoaderWrap = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const CardWrap = styled.View`
  margin-top: 16px;
`;

const EmptyWrap = styled.View`
  padding: 40px 16px;
  align-items: center;
`;

const EmptyText = styled.Text`
  color: #cfcfcf;
`;
