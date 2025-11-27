import { useEffect, useRef, useState } from 'react';
import { postEmailCheck } from '@/src/features/auth/api/postEmailCheck';

export function useCheckEmail(email: string, emailError?: string) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  /* ----- 이메일, 에러가 변경될 때마다 중복 체크 실행 ----- */
  useEffect(() => {
    // 이메일이 비어있거나 유효하지 않은 경우 중단
    if (!email || emailError) {
      setError('');
      setIsChecked(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const minLoadingTime = 800; // 최소 0.8초 로딩
    const startTime = Date.now();

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current); // 이전 Timeout 클리어

    debounceTimeout.current = setTimeout(async () => {
      setIsLoading(true);
      setIsChecked(false);

      try {
        const exists = await postEmailCheck(email);
        if (exists) {
          setError('This email is already in use.');
          return;
        }
        setError('');
        setIsChecked(true);
      } catch (error) {
        setError('Failed to check email. Please try again later.');
      } finally {
        const elapsed = Date.now() - startTime;
        setTimeout(() => setIsLoading(false), Math.max(0, minLoadingTime - elapsed)); // 최소 로딩 시간 보장
      }
    }, 800); // 0.8초 debounce

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [email, emailError]);

  return { isLoading, error, isChecked };
}
