import { useCallback, useState } from 'react';
import { getAppleCredential } from '@/src/features/auth/lib/oauth/apple';
import { postAppleAppLogin } from '@/src/features/auth/api/postAppleAppLogin';
import { saveAuthToken } from '@/src/features/auth/lib/saveAuthToken';
import { getIsAppleUser } from '@/src/features/auth/api/getIsAppleUser';
import { savePrefill } from '@/src/features/profile-setup/lib/prefill';

/**
 * 1. 신규 유저인 경우 === 회원가입
 * 2. 이미 애플로그인에 kori가 등록되어 있는 경우(재가입) === Alert
 * 3. 기존 유저 중 정상 로그인 === 메인 화면 이동
 */
type AppleUserLoginCase = 'newUser' | 'rejoin' | 'normal';

export function useAppleSignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const appleSignIn = useCallback(async (): Promise<AppleUserLoginCase> => {
    setIsLoading(true);
    try {
      const { credential, rawNonce } = await getAppleCredential(); // 애플 사용자 인증

      const { accessToken, refreshToken, userId, isNewUser } = await postAppleAppLogin(credential, rawNonce); // 서버에 애플 로그인 정보 전송
      await saveAuthToken(accessToken, refreshToken, userId); // 토큰 저장

      // 프로필 셋업 prefill
      const firstname = credential.fullName?.givenName;
      const lastname = credential.fullName?.familyName;
      const email = credential.email;

      if (firstname || lastname || email) {
        await savePrefill({
          userId,
          prefill: {
            firstname: firstname ?? undefined,
            lastname: lastname ?? undefined,
            email: email ?? undefined,
          },
        });
      }

      if (isNewUser) {
        const { isRejoiningWithoutFullName } = await getIsAppleUser(userId.toString());
        if (isRejoiningWithoutFullName) {
          return 'rejoin';
        } else {
          return 'newUser';
        }
      } else {
        return 'normal';
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, appleSignIn };
}
