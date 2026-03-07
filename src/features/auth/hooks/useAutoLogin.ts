import { doRefresh } from '@/api/axiosInstance';
import { ACCESS_KEY } from '@/src/lib/auth/session';
import { fetchUserProfile } from '@/src/shared/api/userProfile';
import { getSecureStoreItem } from '@/src/shared/utils/secureStore';
import useAuthStore from '@/src/store/useAuthStore';
import { useCallback, useEffect, useState } from 'react';

export function useAutoLogin(isFontLoaded: boolean) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const autoLogin = useCallback(async () => {
    try {
      const [accessToken, storedUserId] = await Promise.all([
        getSecureStoreItem(ACCESS_KEY),
        getSecureStoreItem('MyuserId'),
      ]);

      // 0. userId가 존재하지 않거나 유효하지 않은 경우 로그인 false
      const userId = storedUserId ? Number(storedUserId) : NaN;
      if (!Number.isFinite(userId)) {
        setIsLoggedIn(false);
        return;
      }

      // 1.) access token이 있으면 해당 토큰으로 유저 정보 조회로 유효성 검증
      //    - 200: 로그인 성공
      //    - 401: axios interceptor가 refresh 후 자동 재시도
      if (accessToken) {
        await fetchUserProfile(userId);
        setIsLoggedIn(true);
        useAuthStore.getState().setCurrentUserId(userId); // userId 상태 저장
        return;
      }

      // 2) access token이 없으면 refresh token으로 토큰 갱신 시도
      const newAccessToken = await doRefresh();
      if (newAccessToken) {
        // 토큰 갱신 성공 시 유저 정보 조회로 유효성 검증
        (await fetchUserProfile(userId), 5000);
        setIsLoggedIn(true);
        useAuthStore.getState().setCurrentUserId(userId); // userId 상태 저장
        return;
      }

      // 3) 모두 실패 시 로그인 false 처리
      setIsLoggedIn(false);
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
