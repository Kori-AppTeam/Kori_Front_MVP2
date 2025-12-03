import { useCallback, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { postRefreshToken } from '@/src/features/auth/api/postRefreshToken';
import { saveAuthToken } from '@/src/features/auth/lib/saveAuthToken';

export function useRefreshToken(isFontLoaded: boolean) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const autoLogin = useCallback(async () => {
    try {
      const currentRefreshToken = await SecureStore.getItemAsync('refresh');
      if (!currentRefreshToken) {
        setIsLoggedIn(false);
        return;
      }
      const { accessToken, refreshToken: newRefreshToken, userId } = await postRefreshToken(currentRefreshToken);
      await saveAuthToken(accessToken, newRefreshToken, userId);

      setIsLoggedIn(true);
    } catch (error) {
      console.error('자동 로그인 실패:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 폰트가 로딩된 후 토큰 갱신
  useEffect(() => {
    if (isFontLoaded) {
      autoLogin();
    }
  }, [isFontLoaded]);

  return { isLoggedIn, isLoading };
}
