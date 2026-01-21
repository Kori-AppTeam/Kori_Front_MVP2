import { postEmailAppLogin } from '@/src/features/auth/api/postEmailAppLogin';
import { saveAuthToken } from '@/src/features/auth/lib/saveAuthToken';
import { useCallback, useState } from 'react';
import { savePrefill } from '@/src/features/profile-setup/lib/prefill';

export function useEmailLogin() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const emailLogin = useCallback(async () => {
    try {
      const {
        accessToken,
        refreshToken,
        userId,
        isNewUser,
        email: responseEmail,
      } = await postEmailAppLogin(email, password);
      await saveAuthToken(accessToken, refreshToken, userId);

      // 프로필 셋업 prefill
      await savePrefill({
        userId,
        prefill: {
          email: responseEmail ?? email,
        },
      });

      return isNewUser;
    } catch (error) {
      throw error;
    }
  }, [email, password]);

  return { email, setEmail, password, setPassword, emailLogin };
}
