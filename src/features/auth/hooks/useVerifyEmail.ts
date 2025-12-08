import { useEffect, useState } from 'react';
import { postSendVerificationEmail } from '@/src/features/auth/api/postSendVerificationEmail';
import { postVerifyCode } from '@/src/features/auth/api/postVerifyCode';

export function useVerifyEmail(email: string) {
  const [isSendCodeLoading, setIsSendCodeLoading] = useState<boolean>(false);
  const [isVerifyCodeLoading, setIsVerifyCodeLoading] = useState<boolean>(false);
  const [verifyCodeError, setVerifyCodeError] = useState<string>('');
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const sendCode = async (email: string) => {
    setIsSendCodeLoading(true);
    setIsCodeSent(false);

    const minLoadingTime = 800; // 최소 0.8초 인디케이터 표시
    const startTime = Date.now();

    try {
      await postSendVerificationEmail(email); // 인증 코드 발송
      setIsCodeSent(true);
    } catch (error) {
      throw error;
    } finally {
      const elapsed = Date.now() - startTime;
      setTimeout(() => setIsSendCodeLoading(false), Math.max(0, minLoadingTime - elapsed));
    }
  };

  const verifyCode = async (email: string, code: string) => {
    setIsVerifyCodeLoading(true);
    setVerifyCodeError('');

    try {
      const verified = await postVerifyCode(email, code); // 인증 코드 검증

      if (!verified) {
        // 검증 실패 시 표시할 메시지 설정
        setVerifyCodeError('The verification code is incorrect.');
      }
      setIsVerified(verified);
    } catch (error) {
      setIsVerified(false);
      throw error;
    } finally {
      setIsVerifyCodeLoading(false);
    }
  };

  useEffect(() => {
    // 이메일이 변경되면 상태 초기화
    setIsCodeSent(false);
    setIsVerified(false);
    setVerifyCodeError('');
  }, [email]);

  return { isSendCodeLoading, isVerifyCodeLoading, verifyCodeError, isVerified, isCodeSent, sendCode, verifyCode };
}
