import { Client } from '@stomp/stompjs';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef, useState } from 'react';
import { refreshTokenIfNeeded } from '../utils/refreshTokenIfNeeded';

interface StompConnectionState {
  connected: boolean;
  client: Client | null;
  error: Error | null;
  connecting: boolean;
}

interface StompConnectionHook {
  state: StompConnectionState;
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: (destination: string, callback: (message: any) => void) => void;
  publish: (destination: string, body: any) => Promise<void>;
}

export const useStompConnection = (): StompConnectionHook => {
  const [state, setState] = useState<StompConnectionState>({
    connected: false,
    client: null,
    error: null,
    connecting: false,
  });

  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, any>>(new Map());

  /** STOMP 연결 함수 */
  const connect = useCallback(async () => {
    if (state.connecting || state.connected) return;

    setState(prev => ({ ...prev, connecting: true, error: null }));

    try {
      let token = await SecureStore.getItemAsync('jwt');

      // 토큰이 없으면 refresh 시도
      if (!token) {
        token = await refreshTokenIfNeeded();
        if (!token) {
          throw new Error('유효한 토큰이 없습니다');
        }
      }

      const connectHeaders = { Authorization: `Bearer ${token}` };

      const client = new Client({
        webSocketFactory: () => new global.WebSocket('wss://dev.ko-ri.cloud/ws'),
        connectHeaders,
        forceBinaryWSFrames: true,
        reconnectDelay: 30000,
        heartbeatIncoming: 60000,
        heartbeatOutgoing: 60000,
        debug: (str) => console.log('[STOMP DEBUG]', str),
      });

      client.onConnect = (frame) => {
        console.log('✅ STOMP 연결 성공');
        setState(prev => ({
          ...prev,
          connected: true,
          connecting: false,
          client,
          error: null,
        }));
      };

      client.onStompError = async (frame) => {
        console.error('❌ STOMP 오류', frame.headers['message']);

        // 토큰 재발급 시도
        const newToken = await refreshTokenIfNeeded();
        if (!newToken) {
          setState(prev => ({
            ...prev,
            error: new Error('토큰 재발급 실패'),
            connecting: false,
          }));
          return;
        }

        // 재연결 시도
        client.deactivate();
        setTimeout(() => connect(), 3000);
      };

      client.onWebSocketError = (evt) => {
        console.error('WebSocket 오류', evt);
        setState(prev => ({
          ...prev,
          error: new Error('WebSocket 연결 오류'),
          connecting: false,
        }));
      };

      client.onWebSocketClose = (evt) => {
        console.log('WebSocket 종료', evt);
        setState(prev => ({
          ...prev,
          connected: false,
          client: null,
        }));
      };

      clientRef.current = client;
      client.activate();

    } catch (error) {
      console.error('STOMP 연결 실패:', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        connecting: false,
      }));
    }
  }, [state.connecting, state.connected, refreshTokenIfNeeded]);

  /** STOMP 연결 해제 */
  const disconnect = useCallback(() => {
    if (clientRef.current?.connected) {
      // 모든 구독 해제
      subscriptionsRef.current.forEach((subscription) => {
        subscription.unsubscribe();
      });
      subscriptionsRef.current.clear();

      clientRef.current.deactivate();
      clientRef.current = null;
    }

    setState({
      connected: false,
      client: null,
      error: null,
      connecting: false,
    });
  }, []);

  /** 메시지 구독
   * @param destination 구독할 destination
   * @param callback 메시지 수신 시 호출될 콜백 함수
  */
  const subscribe = useCallback((destination: string, callback: (message: any) => void) => {
    if (!clientRef.current?.connected) {
      console.warn('STOMP 연결이 되어있지 않습니다');
      return;
    }

    // 이미 구독 중인 destination이면 기존 구독 해제
    if (subscriptionsRef.current.has(destination)) {
      subscriptionsRef.current.get(destination)?.unsubscribe();
    }

    const subscription = clientRef.current.subscribe(destination, (message) => {
      try {
        const body = JSON.parse(message.body);
        callback(body);
      } catch (error) {
        console.error('메시지 파싱 오류:', error);
      }
    });

    subscriptionsRef.current.set(destination, subscription);
  }, [state.connected]);

  /** 메시지 발행
   * @param destination 발행할 destination
   * @param body 발행할 메시지 본문
   */
  const publish = useCallback(async (destination: string, body: any) => {
    if (!clientRef.current?.connected) {
      throw new Error('STOMP 연결이 되어있지 않습니다');
    }

    try {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    } catch (error: any) {
      // 401 오류 시 토큰 갱신 후 재시도
      if (error.message?.includes('401')) {
        const newToken = await refreshTokenIfNeeded();
        if (!newToken) {
          throw new Error('토큰 재발급 실패');
        }

        // 재연결 후 재시도
        await connect();
        if (clientRef.current?.connected) {
          clientRef.current.publish({
            destination,
            body: JSON.stringify(body),
          });
        }
      } else {
        throw error;
      }
    }
  }, [state.connected, refreshTokenIfNeeded, connect]);

  // 컴포넌트 언마운트 시 연결 해제
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    state,
    connect,
    disconnect,
    subscribe,
    publish,
  };
};