import { useCallback, useEffect, useState } from 'react';
import { doRefresh } from '@/api/axiosInstance';

export function useAutoLogin(isFontLoaded: boolean) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const autoLogin = useCallback(async () => {
    try {
      const accessToken = await doRefresh(); // 토큰 갱신 시도
      setIsLoggedIn(!!accessToken);
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
