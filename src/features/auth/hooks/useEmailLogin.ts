import { postEmailAppLogin } from '@/src/features/auth/api/postEmailAppLogin';
import { saveAuthToken } from '@/src/features/auth/lib/saveAuthToken';
import { useCallback, useState } from 'react';

export function useEmailLogin() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const emailLogin = useCallback(async () => {
    try {
      const { accessToken, refreshToken, userId, isNewUser } = await postEmailAppLogin(email, password);
      await saveAuthToken(accessToken, refreshToken, userId);

      return isNewUser;
    } catch (error) {
      throw error;
    }
  }, [email, password]);

  return { email, setEmail, password, setPassword, emailLogin };
}
