import { postGoogleAppLogin } from '@/src/features/auth/api/postGoogleAppLogin';
import { getGoogleAuthCode } from '@/src/features/auth/lib/oauth/google';
import { saveAuthToken } from '@/src/features/auth/lib/saveAuthToken';
import { useCallback, useState } from 'react';
import { savePrefill } from '@/src/features/profile-setup/lib/prefill';

export function useGoogleSignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const googleSignIn = useCallback(async () => {
    setIsLoading(true);
    try {
      const code = await getGoogleAuthCode();
      if (!code?.code) throw new Error('GOOGLE_NO_AUTH_CODE');

      const { accessToken, refreshToken, userId, isNewUser } = await postGoogleAppLogin(code.code);
      await saveAuthToken(accessToken, refreshToken, userId);

      const email = code.profile?.email;
      const firstname = code.profile?.givenName;
      const lastname = code.profile?.familyName;

      // 프로필 셋업 프리필
      if (email || firstname || lastname) {
        await savePrefill({
          userId,
          prefill: {
            email,
            firstname,
            lastname,
          },
        });
      }

      return { isNewUser };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, googleSignIn };
}
