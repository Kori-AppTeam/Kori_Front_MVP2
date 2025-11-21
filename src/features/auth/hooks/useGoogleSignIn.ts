import { postGoogleAppLogin } from '@/src/features/auth/api/postGoogleAppLogin';
import { getGoogleAuthCode } from '@/src/features/auth/lib/oauth/google';
import { saveAuthToken } from '@/src/features/auth/lib/saveAuthToken';
import { useCallback, useState } from 'react';

export function useGoogleSignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const googleSignIn = useCallback(async () => {
    setIsLoading(true);
    try {
      const code = await getGoogleAuthCode();
      if (!code) throw new Error('GOOGLE_NO_AUTH_CODE');

      const { accessToken, refreshToken, userId, isNewUser } = await postGoogleAppLogin(code);
      await saveAuthToken(accessToken, refreshToken, userId);

      return { isNewUser };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, googleSignIn };
}
