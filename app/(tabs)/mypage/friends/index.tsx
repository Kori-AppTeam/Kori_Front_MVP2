import Icon from '@/components/common/Icon';
import useUnfollowAccepted from '@/hooks/mutations/useUnfollowAccepted'; // ✅ 변경
import { useAcceptedFollowing } from '@/hooks/queries/useFollowing';
import UserProfileCard from '@/src/shared/components/UserProfileCard';

import { useCreateOneToOneRoom } from '@/src/features/chat/room/hooks/useCreateOneToOneRoom';
import { theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Dimensions } from 'react-native';
import styled from 'styled-components/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FriendsOnlyScreen() {
  const { data, isLoading, isError, refetch } = useAcceptedFollowing();

  const createChatRoom = useCreateOneToOneRoom();

  const totalPages = data?.length ?? 0;
  const [page, setPage] = useState(1);
  const listRef = useRef<import('react-native').FlatList>(null);

  const unfollowMutation = useUnfollowAccepted(); // ✅ 변경

  const confirmUnfollow = (userId: number) => {
    Alert.alert(
      'Are you sure you want to cancel follow?',
      'If you cancel follow, this will be removed from your friends list.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unfollow',
          style: 'destructive',
          onPress: async () => {
            try {
              await unfollowMutation.mutateAsync(userId);
              await refetch();
            } catch (e) {
              console.error('[unfollow] error', e);
              Alert.alert('Failed to unfollow', 'Please try again later.');
            }
          },
        },
      ],
    );
  };

  const goToIndex = (indexZeroBased: number) => {
    if (!listRef.current) return;
    const safeIndex = Math.max(0, Math.min(totalPages - 1, indexZeroBased));
    listRef.current.scrollToIndex({ index: safeIndex, animated: true });
  };

  return (
    <Safe>
      <Header>
        <BackBtn onPress={() => router.back()}>
          <Icon type="previous" size={24} color={theme.colors.primary.white} />
        </BackBtn>

        <TitleWrap pointerEvents="none">
          <Title>Friends List</Title>
        </TitleWrap>
      </Header>

      <HList
        ref={listRef}
        data={data}
        keyExtractor={(item) => String(item.userId)}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const idx = Math.round(x / SCREEN_WIDTH);
          setPage(idx + 1);
        }}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Page style={{ width: SCREEN_WIDTH }}>
            <Inner>
              <UserProfileCard
                user={item}
                defaultExpanded={true}
                actions={{
                  primary: {
                    label: 'Unfollow',
                    onPress: () => confirmUnfollow(item.userId),
                  },
                  chat: {
                    label: 'Chat',
                    onPress: () =>
                      createChatRoom.mutate({
                        otherUserId: item.id,
                        userName: `${item.firstname} ${item.lastname}`,
                        routeType: 'push',
                      }),
                  },
                }}
              />
            </Inner>
          </Page>
        )}
        ListEmptyComponent={
          <Empty>
            <EmptyText>{isLoading ? 'Loading...' : isError ? 'Failed to load.' : 'No friends yet.'}</EmptyText>
          </Empty>
        }
      />

      <Pager>
        <PagerBtn disabled={page <= 1} onPress={() => goToIndex(page - 2)}>
          <PagerArrow>‹</PagerArrow>
        </PagerBtn>

        <PagerText>{` ${page} / ${totalPages} `}</PagerText>

        <PagerBtn disabled={page >= totalPages} onPress={() => goToIndex(page)}>
          <PagerArrow>›</PagerArrow>
        </PagerBtn>
      </Pager>
    </Safe>
  );
}

const Safe = styled.SafeAreaView`
  flex: 1;
  background: #1d1e1f;
`;
const Header = styled.View`
  position: relative;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
`;
const BackBtn = styled.Pressable`
  width: 40px;
  align-items: flex-start;
`;
const TitleWrap = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  align-items: center;
`;
const Title = styled.Text`
  color: #fff;
  font-size: 18px;
  font-family: 'PlusJakartaSans_700Bold';
`;
const HList = styled.FlatList`` as unknown as typeof import('react-native').FlatList;
const Page = styled.View`
  justify-content: center;
`;
const Inner = styled.View`
  padding: 0 16px;
  margin-top: -30px;
`;
const Pager = styled.View`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const PagerBtn = styled.Pressable<{ disabled?: boolean }>`
  opacity: ${(p) => (p.disabled ? 0.3 : 1)};
  padding: 6px 10px;
`;
const PagerArrow = styled.Text`
  color: #b7babd;
  font-size: 20px;
  padding: 0 4px;
`;
const PagerText = styled.Text`
  color: #b7babd;
  font-size: 12px;
  font-family: 'PlusJakartaSans_400Regular';
`;
const Empty = styled.View`
  padding: 40px 16px;
  align-items: center;
`;
const EmptyText = styled.Text`
  color: #cfcfcf;
`;
