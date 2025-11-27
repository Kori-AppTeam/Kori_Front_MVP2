// src/features/find/hooks/useFindFriends.ts

import { useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import type { FriendItem } from '../types';
import { extractFollowingIds, getMyUserId } from '../utils/helpers';
import { useCancelFollowRequest } from './useCancelFollowRequest';
import { useCreateOneToOneRoom } from './useCreateOneToOneRoom';
import { useAcceptedFollowing, useSentFollowRequestsSet } from './useFollowingStatus';
import { useFollowUser } from './useFollowUser';
import { useRecommendedFriends } from './useRecommendedFriends';

/**
 * Find Friends 화면의 메인 비즈니스 로직 Hook
 * 
 * TODO: DeviceEventEmitter를 사용한 하이브리드 방식에서
 * 향후 react-query로 완전히 전환 예정
 */
export function useFindFriends(limit: number = 20) {
  // Queries & Mutations
  const { data: friends, isLoading, isFetching, refetch } = useRecommendedFriends(limit);
  const followMutation = useFollowUser();
  const cancelReqMutation = useCancelFollowRequest();
  const { mutateAsync: createRoom, isPending: creatingRoom } = useCreateOneToOneRoom();

  // Following Status
  const { data: accepted } = useAcceptedFollowing();
  const { set: sentSet } = useSentFollowRequestsSet();

  // Local State
  const [myId, setMyId] = useState<number | undefined>(undefined);
  const [requested, setRequested] = useState<Set<number>>(new Set());
  const [inFlight, setInFlight] = useState<Set<number>>(new Set());

  // Load myId from SecureStore
  useEffect(() => {
    getMyUserId().then((id) => setMyId(id));
  }, []);

  // DeviceEventEmitter listeners
  // TODO: react-query로 완전히 전환 후 제거 예정
  useEffect(() => {
    const subCancel = DeviceEventEmitter.addListener(
      'FOLLOW_REQUEST_CANCELLED',
      (p: { userId: number }) => {
        if (p?.userId) {
          setRequested((prev) => {
            const next = new Set(prev);
            next.delete(p.userId);
            return next;
          });
        }
      }
    );

    const subSent = DeviceEventEmitter.addListener(
      'FOLLOW_REQUEST_SENT',
      (p: { userId: number }) => {
        if (p?.userId) {
          setRequested((prev) => {
            const next = new Set(prev);
            next.add(p.userId);
            return next;
          });
        }
      }
    );

    return () => {
      subCancel.remove();
      subSent.remove();
    };
  }, []);

  // Compute following set
  const followingSet = extractFollowingIds(accepted);

  // Filter friend list
  const filteredList: FriendItem[] = (friends ?? []).filter((u) => {
    const id = u.userId;
    if (!Number.isFinite(id)) return false;
    if (myId && id === myId) return false;
    if (followingSet.has(id)) return false;
    if (sentSet.has(id)) return false;
    if (requested.has(id)) return false;
    return true;
  });

  // Helper functions
  const lock = (id: number) => setInFlight((s) => new Set(s).add(id));
  const unlock = (id: number) => {
    setInFlight((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
  };

  const markRequested = (id: number) => {
    setRequested((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const unmarkRequested = (id: number) => {
    setRequested((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return {
    // Data
    friends: filteredList,
    myId,

    // Loading states
    loading: {
      isLoading,
      isFetching,
      creatingRoom,
    },

    // State
    state: {
      requested,
      inFlight,
    },

    // Mutations
    mutations: {
      followMutation,
      cancelReqMutation,
      createRoom,
    },

    // Actions
    actions: {
      refetch,
      lock,
      unlock,
      markRequested,
      unmarkRequested,
    },
  };
}
