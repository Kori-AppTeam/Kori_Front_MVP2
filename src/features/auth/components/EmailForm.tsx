import React, { useState } from 'react';
import styled from 'styled-components/native';
import { useFormContext } from 'react-hook-form';

import ActionInput from '@/src/features/auth/components/ActionInput';
import ErrorMessage from '@/src/features/auth/components/ErrorMessage';

const EmailForm = () => {
  const [code, setCode] = useState<string>(''); // TODO 인증 코드 상태 관리

  const emailSend = false; // TODO 인증 코드 발송 상태 관리
  const emailVerified = false; // TODO 이메일 인증 상태 관리

  const {
    formState: { errors },
    getValues,
  } = useFormContext();

  const isEmailValid = !errors.email && !!getValues('email');
  const isCodeValid = !errors.verificationCode && !!getValues('verificationCode');

  const handleSendCode = () => {
    try {
      // TODO 인증 코드 전송 로직을 hook으로 분리
    } catch (error) {
      // TODO 에러 처리 및 toast 알림
    }
  };

  const handleVerifyCode = () => {
    try {
      // TODO 인증 코드 검증 로직을 hook으로 분리
    } catch (error) {
      // TODO 에러 처리 및 toast 알림
    }
  };

  return (
    <EmailFormContainer>
      <EmailFormSection>
        <ActionInput
          placeholder="Enter email address"
          label="Email"
          onActionPress={handleSendCode}
          isActionSuccess={emailSend}
          actionLabelText="Send"
          registerField="email"
          actionDisabled={!isEmailValid || emailSend}
        />
        <ErrorMessage message={errors.email?.message as string} />
      </EmailFormSection>
      <EmailFormSection>
        <ActionInput
          placeholder="Enter Code"
          label="Code Verification"
          onActionPress={handleVerifyCode}
          isActionSuccess={emailVerified}
          actionLabelText="Verify"
          registerField="verificationCode"
          actionDisabled={!isCodeValid || emailVerified}
        />
        <ErrorMessage message={errors.verificationCode?.message as string} />
      </EmailFormSection>
    </EmailFormContainer>
  );
};

export default EmailForm;

const EmailFormContainer = styled.View`
  width: 100%;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
`;

const EmailFormSection = styled.View`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
`;
