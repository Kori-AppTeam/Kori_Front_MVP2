import { ACCESS_KEY, isRefreshBlocked, REFRESH_KEY } from '@/src/lib/auth/session';
import { Config } from '@/src/shared/constants/config';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = Config.SERVER_URL;

function shortUrl(base: string, url?: string) {
  if (!url) return '';
  try {
    const u = new URL(url, base);
    return u.pathname + (u.search || '');
  } catch {
    return url;
  }
}

export const doRefresh = async (): Promise<string | null> => {
  const rt = await SecureStore.getItemAsync(REFRESH_KEY);
  if (!rt) {
    // 리프레시 토큰이 없을 경우 남아있을 수 있는 Authorization 헤더 제거
    delete (api.defaults.headers as any).Authorization;
    return null;
  }

  try {
    const res = await api.post('/api/v1/member/refresh', { refreshToken: rt });
    const data = (res as any).data?.data || {};
    const newAt: string | undefined = data.accessToken;
    const newRt: string | undefined = data.refreshToken;

    if (newAt) {
      await SecureStore.setItemAsync(ACCESS_KEY, newAt);
      (api.defaults.headers as any).Authorization = `Bearer ${newAt}`;
      redirectingToAuth = false;
    }
    if (newRt) {
      await SecureStore.setItemAsync(REFRESH_KEY, newRt);
    }
    return newAt ?? null;
  } catch {
    // 리프레시 실패 시 저장된 토큰과 헤더를 정리해 이후 요청에서 만료된 토큰이 다시 실리지 않도록 함
    await SecureStore.deleteItemAsync(ACCESS_KEY).catch(() => {});
    await SecureStore.deleteItemAsync(REFRESH_KEY).catch(() => {});
    delete (api.defaults.headers as any).Authorization;
    return null;
  }
};

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

let refreshPromise: Promise<string | null> | null = null;
let redirectingToAuth = false;

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
    if (!isFormData) {
      (config.headers as any)['Content-Type'] = 'application/json';
    }

    const token = await SecureStore.getItemAsync(ACCESS_KEY);
    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    (config as any).meta = { start: Date.now(), token };

    const method = (config.method || 'GET').toUpperCase();
    const base = config.baseURL || BASE_URL;
    const fullUrl = new URL(config.url || '', base).toString();
    if (config.data && !isFormData) {
      try {
        const s = JSON.stringify(config.data);
        if (s.length <= 400) console.log('[axios:req] body', JSON.parse(s));
        else console.log('[axios:req] body(len)', s.length);
      } catch {}
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (res) => {
    const cfg: any = res.config || {};
    const ms = cfg.meta?.start ? Date.now() - cfg.meta.start : undefined;
    const path = shortUrl(cfg.baseURL || BASE_URL, res.config.url);
    console.log(`[axios:res] ${res.status} ${path}${ms ? ` (${ms}ms)` : ''}`);
    return res;
  },
  async (error: AxiosError<any>) => {
    const cfg: any = error.config || {};
    const ms = cfg.meta?.start ? Date.now() - cfg.meta.start : undefined;
    const status = error.response?.status ?? 'ERR';
    const path = cfg?.url ? shortUrl(cfg.baseURL || BASE_URL, cfg.url) : '';
    console.log(`[axios:err] ${status} ${path}${ms ? ` (${ms}ms)` : ''}`, error.response?.data || error.message);

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (isRefreshBlocked()) {
      return Promise.reject(error);
    }

    if (cfg?.url?.includes('/api/v1/member/refresh')) {
      return Promise.reject(error);
    }

    if (cfg._retry) {
      return Promise.reject(error);
    }
    cfg._retry = true;

    try {
      if (!refreshPromise) refreshPromise = doRefresh();
      const newAccess = await refreshPromise;

      // 👇 [로그 1] 새 액세스 토큰을 성공적으로 받았는지 확인
      console.log('[axios:refresh] 새 액세스 토큰 수신:', newAccess ? '성공 (토큰 있음)' : '실패 (null 반환됨)');

      refreshPromise = null;

      if (!newAccess) {
        // 👇 [로그 2] 토큰 갱신이 실패해서 원래 요청을 거부함
        console.log('[axios:refresh] 새 토큰이 없으므로, 401 에러를 그대로 반환합니다.');

        // 토큰이 없으면 서버에 요청 보내지 말고, 로그인 화면으로 보내기
        await SecureStore.deleteItemAsync(ACCESS_KEY);
        await SecureStore.deleteItemAsync(REFRESH_KEY);
        delete (api.defaults.headers as any).Authorization;

        if (!redirectingToAuth) {
          redirectingToAuth = true; // 중복 리다이렉트 방지
          router.replace('/(auth)');
        }

        return Promise.reject(error);
      }

      (cfg.headers as any).Authorization = `Bearer ${newAccess}`;
      // 👇 [로그 3] 새 토큰으로 원래 요청을 재시도함
      console.log('[axios:refresh] 새 토큰으로 원래 요청을 재시도합니다:', cfg.url);
      return api(cfg); // 원래 요청 재시도
    } catch (e) {
      // 👇 [로그 4] 'doRefresh' 함수 자체가 실패(throw error)한 경우
      console.error('[axios:refresh] 토큰 갱신(doRefresh) 함수 실행 중 예외 발생:', e);
      refreshPromise = null;
      return Promise.reject(e);
    }
  },
);

export default api;
