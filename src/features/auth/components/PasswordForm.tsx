import ErrorMessage from '@/src/features/auth/components/ErrorMessage';
import ValidationChecklist from '@/src/features/auth/components/ValidationChecklist';
import Input from '@/src/shared/components/Input';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components/native';

const PasswordForm = () => {
  const [password, setPassword] = useState<string>(''); // TODO 비밀번호 상태 관리
  const [repeatPassword, setRepeatPassword] = useState<string>(''); // TODO 비밀번호 확인 상태 관리
  const passwordRepeatErrorMessage = 'Your password do not match.'; // TODO 비밀번호 확인 에러 메시지 상태 관리

  const {
    formState: { errors },
  } = useFormContext();

  return (
    <PasswordFormContainer>
      <PasswordFormSection>
        <Input label="Password" placeholder="Enter Password" registerField="password" secureTextEntry />
        <ValidationChecklist />
      </PasswordFormSection>
      <PasswordFormSection>
        <Input label="Repeat Password" placeholder="Enter Password" registerField="passwordConfirm" secureTextEntry />
        <ErrorMessage message={errors?.passwordConfirm?.message as string} />
      </PasswordFormSection>
    </PasswordFormContainer>
  );
};

export default PasswordForm;

const PasswordFormContainer = styled.View`
  width: 100%;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 32px;
`;

const PasswordFormSection = styled.View`
  width: 100%;
  flex-direction: column;
  gap: 8px;
`;
