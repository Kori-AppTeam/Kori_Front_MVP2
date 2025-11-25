import React, { useState } from 'react';
import ActionInput from '@/src/features/auth/components/ActionInput';
import styled from 'styled-components/native';
import ErrorMessage from '@/src/features/auth/components/ErrorMessage';

const EmailForm = () => {
  const [email, setEmail] = useState<string>(''); // TODO 이메일 상태 관리
  const [code, setCode] = useState<string>(''); // TODO 인증 코드 상태 관리
  const emailVerified = false; // TODO 이메일 인증 상태 관리
  const emailErrorMessage = 'This email is already in use.'; // TODO 에러 메시지 상태 관리
  const verificationErrorMessage = 'Invalid verification code.'; // TODO 인증 코드 에러 메시지 상태 관리

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
          value={email}
          label="Email"
          onChangeText={(text) => setEmail(text)}
          onActionPress={handleSendCode}
          isActionSuccess={emailVerified}
          actionLabelText="Send"
        />
        <ErrorMessage message={emailErrorMessage} />
      </EmailFormSection>
      {!emailVerified && (
        <EmailFormSection>
          <ActionInput
            placeholder="Enter Code"
            value={code}
            label="Code Verification"
            onChangeText={(text) => setCode(text)}
            onActionPress={handleVerifyCode}
            actionLabelText="Verify"
          />
          <ErrorMessage message={verificationErrorMessage} />
        </EmailFormSection>
      )}
    </EmailFormContainer>
  );
};

export default EmailForm;

const EmailFormContainer = styled.View`
  width: 100%;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
`;

const EmailFormSection = styled.View`
  width: 100%;
  flex-direction: column;
  gap: 8px;
`;
