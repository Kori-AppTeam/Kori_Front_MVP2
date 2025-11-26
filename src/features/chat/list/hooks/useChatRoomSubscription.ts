import { useStompStore } from '@/src/store/useStompStore';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { MyChatRoom, UseChatRoomSubscriptionProps } from '../types';

export function useChatRoomSubscription({ onRoomUpdate, enabled = true }: UseChatRoomSubscriptionProps) {
  const subscribe = useStompStore((state) => state.subscribe);
  const connected = useStompStore((state) => state.connected);

  useEffect(() => {
    if (!connected || !enabled) return;

    let unsubscribe: (() => void) | undefined;

    const setupSubscription = async () => {
      const MyuserId = await SecureStore.getItemAsync('MyuserId');

      if (!MyuserId) {
        console.warn('User ID not found in SecureStore');
        return;
      }

      unsubscribe = subscribe(`/topic/user/${MyuserId}/rooms`, (updatedRoom: MyChatRoom) => {
        onRoomUpdate(updatedRoom);
      });
    };

    setupSubscription();

    return () => {
      unsubscribe?.();
    };
  }, [connected, enabled, subscribe, onRoomUpdate]);
}
