import { useCallback, useState } from 'react';
import { SignUpFormValues } from '@/src/features/auth/types';
import { requestLocationPermission } from '@/src/features/auth/lib/requestLocationPermission';
import { postEmailSignUp } from '@/src/features/auth/api/postEmailSignUp';
import { saveAuthToken } from '@/src/features/auth/lib/saveAuthToken';
import { patchLocation } from '@/api/member/location';
import { savePrefill } from '@/src/features/profile-setup/lib/prefill';

export function useEmailSignUp() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /* ----- 이메일 회원가입 ----- */
  const emailSignUp = useCallback(async ({ email, password }: SignUpFormValues) => {
    setIsLoading(true);

    try {
      // 위치 권한 요청 및 위치 정보 가져오기
      const { latitude, longitude } = await requestLocationPermission();

      // 회원가입 및 토큰 저장
      const { accessToken, refreshToken, userId } = await postEmailSignUp(email, password);
      await saveAuthToken(accessToken, refreshToken, userId);

      if (email) {
        await savePrefill({
          userId,
          prefill: {
            email: email ?? undefined,
          },
        });
      }

      // 위치 정보 업데이트
      await patchLocation(latitude, longitude);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    emailSignUp,
    isLoading,
  };
}
