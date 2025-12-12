import ProfileSetupModal from '@/components/common/ProfileSetupModal';
import FriendCard from '@/components/FriendCard';
import { useRequestFeedback } from '@/src/features/feedback/hooks/useRequestFeedback';
import { FindHeader } from '@/src/features/find/components/FindHeader';
import { LinkedSpaceRecommendModal } from '@/src/features/find/components/LinkedSpaceRecommendModal';
import { useFindCardActions } from '@/src/features/find/hooks/useFindCardActions';
import { useFindFriends } from '@/src/features/find/hooks/useFindFriends';
import { useLinkedSpaceRecommendModal } from '@/src/features/find/hooks/useLinkedSpaceRecommendModal';
import { Text } from '@react-navigation/elements';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, FlatList, RefreshControl } from 'react-native';
import styled from 'styled-components/native';

export default function index() {
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const { friends, myId, loading, state, mutations, actions } = useFindFriends(20);

  const { handleFollowRequest, handleCancelRequest, handleCreateChat } = useFindCardActions({
    myId,
    state,
    mutations,
    actions,
    setProfileModalVisible,
  });

  const {
    visible: recommendVisible,
    profileModalVisible: recommendProfileModal,
    setProfileModalVisible: setRecommendProfileModal,
    handleJoin,
    handleDontShowToday,
    handleClose: handleRecommendClose,
  } = useLinkedSpaceRecommendModal();

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
    actions.refetch();
  };

  return (
    <Safe>
      <FindHeader />

      {loading.isLoading ? (
        <LoaderWrap>
          <ActivityIndicator />
        </LoaderWrap>
      ) : (
        <FlatList
          ref={flatListRef}
          data={friends}
          keyExtractor={(item) => String(item.userId)}
          refreshControl={
            <RefreshControl refreshing={Boolean(loading.isFetching && !loading.isLoading)} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          renderItem={({ item }) => {
            const uid = item.userId;
            const isSent = state.requested.has(uid);
            const fullName = [item.firstname, item.lastname].filter(Boolean).join(' ').trim() || 'Unknown';

            return (
              <CardWrap>
                <FriendCard
                  userId={uid}
                  name={fullName}
                  country={item.country || '-'}
                  birth={item.birthday}
                  gender={item.gender || 'unspecified'}
                  purpose={item.purpose || '-'}
                  languages={item.language || []}
                  personalities={item.hobby || []}
                  bio={item.introduction || undefined}
                  imageUrl={item.imageKey}
                  imageKey={item.imageKey}
                  defaultExpanded={false}
                  mode={isSent ? 'sent' : 'friend'}
                  onFollow={() => handleFollowRequest(uid)}
                  onCancel={() => handleCancelRequest(uid)}
                  onChat={() => handleCreateChat(uid, fullName)}
                />
              </CardWrap>
            );
          }}
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
