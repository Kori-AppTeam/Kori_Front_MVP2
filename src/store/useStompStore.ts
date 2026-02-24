// src/store/useStompStore.ts
import { refreshTokenIfNeeded } from '@/src/shared/utils/refreshTokenIfNeeded';
import { Client } from '@stomp/stompjs';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

interface StompStore {
  client: Client | null;
  connected: boolean;
  connecting: boolean;
  error: Error | null;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: (destination: string, callback: (message: any) => void) => () => void;
  publish: (destination: string, body: any) => Promise<void>;
}

// 구독 관리를 위한 Map (store 외부에 선언)
const subscriptions = new Map<string, any>();

export const useStompStore = create<StompStore>((set, get) => ({
  client: null,
  connected: false,
  connecting: false,
  error: null,

  connect: async () => {
    const { connecting, connected } = get();
    if (connecting || connected) return;

    set({ connecting: true, error: null });

    try {
      let token = await SecureStore.getItemAsync('jwt');

      if (!token) {
        token = await refreshTokenIfNeeded();
        if (!token) {
          throw new Error('유효한 토큰이 없습니다');
        }
      }

      const newClient = new Client({
        webSocketFactory: () =>
          new WebSocket(__DEV__ ? process.env.EXPO_PUBLIC_WSS_URL_DEV! : process.env.EXPO_PUBLIC_WSS_URL_PROD!),
        connectHeaders: { Authorization: `Bearer ${token}` },
        forceBinaryWSFrames: true,
        reconnectDelay: 5000,
        heartbeatIncoming: 60000,
        heartbeatOutgoing: 60000,
        debug: (str) => console.log('[STOMP]', str),
      });

      newClient.onConnect = () => {
        console.log('✅ STOMP 연결 성공');
        set({ connected: true, connecting: false, client: newClient });
      };

      newClient.onStompError = async (frame) => {
        console.error('❌ STOMP 오류', frame.headers['message']);
        const newToken = await refreshTokenIfNeeded();
        if (newToken) {
          newClient.deactivate();
          setTimeout(() => get().connect(), 3000);
        } else {
          set({ error: new Error('토큰 재발급 실패'), connecting: false });
        }
      };

      newClient.onWebSocketError = (evt) => {
        console.error('WebSocket 오류', evt);
        set({ error: new Error('WebSocket 연결 오류'), connecting: false });
      };

      newClient.onWebSocketClose = () => {
        console.log('WebSocket 종료');
        set({ connected: false, client: null });
      };

      newClient.activate();
      set({ client: newClient });
    } catch (error) {
      console.error('STOMP 연결 실패:', error);
      set({ error: error as Error, connecting: false });
    }
  },

  disconnect: () => {
    const { client } = get();
    if (client?.connected) {
      subscriptions.forEach((sub) => sub.unsubscribe());
      subscriptions.clear();
      client.deactivate();
    }
    set({ connected: false, client: null, connecting: false });
  },

  subscribe: (destination: string, callback: (message: any) => void) => {
    const { client, connected } = get();

    if (!client?.connected || !connected) {
      console.warn('[STOMP] 연결되지 않음');
      return () => {};
    }

    // 이미 구독 중이면 해제
    if (subscriptions.has(destination)) {
      subscriptions.get(destination)?.unsubscribe();
    }

    const subscription = client.subscribe(destination, (msg) => {
      try {
        const body = JSON.parse(msg.body);
        callback(body);
      } catch (error) {
        console.error('[STOMP] 메시지 파싱 오류:', error);
      }
    });

    subscriptions.set(destination, subscription);

    // unsubscribe 함수 반환
    return () => {
      subscription.unsubscribe();
      subscriptions.delete(destination);
    };
  },

  publish: async (destination: string, body: any) => {
    const { client, connected, connect } = get();

    if (!client?.connected || !connected) {
      throw new Error('[STOMP] 연결되지 않음');
    }

    try {
      client.publish({
        destination,
        body: JSON.stringify(body),
      });
    } catch (error: any) {
      if (error?.message?.includes('401')) {
        const newToken = await refreshTokenIfNeeded();
        if (newToken) {
          await connect();
          const { client: reconnectedClient } = get();
          if (reconnectedClient?.connected) {
            reconnectedClient.publish({
              destination,
              body: JSON.stringify(body),
            });
          }
        }
      } else {
        console.error('[STOMP] 메시지 발행 오류:', error);
        throw error;
      }
    }
  },
}));

// 앱 시작 시 자동 연결을 위한 초기화 함수
export const initializeStomp = () => {
  useStompStore.getState().connect();
};
