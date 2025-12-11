import ProfileSetupModal from '@/components/common/ProfileSetupModal';
import FriendCard from '@/components/FriendCard';
import { FindHeader } from '@/src/features/find/components/FindHeader';
import { LinkedSpaceRecommendModal } from '@/src/features/find/components/LinkedSpaceRecommendModal';
import { useFindFriends } from '@/src/features/find/hooks/useFindFriends';
import { useLinkedSpaceRecommendModal } from '@/src/features/find/hooks/useLinkedSpaceRecommendModal';
import { CHAT_ROUTE } from '@/src/shared/constants/route';
import { useRequestFeedback } from '@/src/shared/hooks/useRequestFeedback';
import { Text } from '@react-navigation/elements';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, FlatList, RefreshControl } from 'react-native';
import styled from 'styled-components/native';

export default function index() {
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const { friends, myId, loading, state, mutations, actions } = useFindFriends(20);

  const {
    visible: recommendVisible,
    profileModalVisible: recommendProfileModal,
    setProfileModalVisible: setRecommendProfileModal,
    handleJoin,
    handleDontShowToday,
    handleClose: handleRecommendClose,
  } = useLinkedSpaceRecommendModal();
  useRequestFeedback();

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
                  onFollow={async () => {
                    if ((myId && uid === myId) || state.inFlight.has(uid)) return;

                    const already = state.requested.has(uid);
                    if (!already) actions.markRequested(uid);

                    try {
                      actions.lock(uid);
                      await mutations.followMutation.mutateAsync(uid);
                      actions.markRequested(uid);
                      DeviceEventEmitter.emit('FOLLOW_REQUEST_SENT', { userId: uid });
                    } catch (e: any) {
                      const status = e?.response?.status;

                      if (status === 428) {
                        actions.unmarkRequested(uid);
                        setProfileModalVisible(true);
                        return;
                      }

                      Alert.alert('Failed', e?.response?.data?.message ?? 'Failed to send request.');
                    } finally {
                      actions.unlock(uid);
                    }
                  }}
                  onCancel={async () => {
                    if ((myId && uid === myId) || state.inFlight.has(uid)) return;
                    const wasSent = state.requested.has(uid);
                    if (wasSent) actions.unmarkRequested(uid);

                    try {
                      actions.lock(uid);
                      await mutations.cancelReqMutation.mutateAsync(uid);
                      DeviceEventEmitter.emit('FOLLOW_REQUEST_CANCELLED', { userId: uid });
                    } catch (e: any) {
                      if (e?.response?.status !== 404) {
                        Alert.alert('Failed', e?.response?.data?.message ?? 'Failed to cancel request.');
                      }
                      if (wasSent) actions.markRequested(uid);
                    } finally {
                      actions.unlock(uid);
                    }
                  }}
                  onChat={async () => {
                    try {
                      const roomId = await mutations.createRoom({ otherUserId: uid });
                      router.push({
                        pathname: CHAT_ROUTE(roomId),
                        params: { userId: String(uid), roomName: encodeURIComponent(fullName) },
                      });
                    } catch (err: any) {
                      const status = err.response?.status;

                      if (status === 428) {
                        setProfileModalVisible(true);
                        return;
                      }

                      Alert.alert('Chat Error', err?.response?.data?.message ?? 'Failed to create chat room.');
                    }
                  }}
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
