import api from '@/api/axiosInstance';
import * as SecureStore from 'expo-secure-store';

/** refreshToken 갱신 함수 */
export const refreshTokenIfNeeded = async (): Promise<string | null> => {
  try {
    const refresh = await SecureStore.getItemAsync('refresh');
    if (!refresh) return null;
    const res = await api.post('/api/v1/member/refresh', { refreshToken: refresh });
    const newToken = res.data.data.accessToken;
    const newRefreshToken = res.data.data.refreshToken;
    if (newToken) {
      await SecureStore.setItemAsync('jwt', newToken);
      await SecureStore.setItemAsync('refresh', newRefreshToken);

      return newToken;
    }
    return null;
  } catch (err) {
    console.error('[AUTH] 토큰 재발급 실패', err);
    return null;
  }
};
