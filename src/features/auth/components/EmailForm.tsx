import React from 'react';
import styled from 'styled-components/native';
import { useFormContext } from 'react-hook-form';
import Toast from 'react-native-toast-message';

import ActionInput from '@/src/features/auth/components/ActionInput';
import ErrorMessage from '@/src/features/auth/components/ErrorMessage';
import { useVerifyEmail } from '@/src/features/auth/hooks/useVerifyEmail';
import { useCheckEmail } from '@/src/features/auth/hooks/useCheckEmail';
import { getAxiosErrorCode } from '@/src/shared/utils/getAxiosErrorCode';
import { EMAIL_SIGNUP_ERROR } from '@/src/features/auth/constants/error';

interface EmailFormProps {
  useCheckEmail: ReturnType<typeof useCheckEmail>;
  useVerifyEmail: ReturnType<typeof useVerifyEmail>;
}

const EmailForm = ({ useCheckEmail, useVerifyEmail }: EmailFormProps) => {
  const { isLoading: isCheckEmailLoading, error: checkEmailError, isChecked } = useCheckEmail;
  const { isSendCodeLoading, isVerifyCodeLoading, verifyCodeError, isVerified, isCodeSent, sendCode, verifyCode } =
    useVerifyEmail;

  const {
    formState: { errors },
    watch,
  } = useFormContext();

  const emailError = errors.email?.message as string;
  const codeError = errors.verificationCode?.message as string;

  const isEmailValid = !errors.email && !!watch('email');
  const isCodeValid = !errors.verificationCode && !!watch('verificationCode');

  const handleSendCode = async () => {
    try {
      await sendCode(watch('email'));
    } catch (error) {
      const errorCode = getAxiosErrorCode(error);
      const errorConfig = EMAIL_SIGNUP_ERROR[errorCode];

      Toast.show({
        type: 'error',
        text1: errorConfig.message,
        text2: `Please try again later.`,
        position: 'bottom',
        bottomOffset: 180,
      });
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyCode(watch('email'), watch('verificationCode'));
    } catch (error) {
      const errorCode = getAxiosErrorCode(error);
      const errorConfig = EMAIL_SIGNUP_ERROR[errorCode];

      Toast.show({
        type: 'error',
        text1: errorConfig.message,
        text2: `Please try again later.`,
        position: 'bottom',
        bottomOffset: 180,
      });
    }
  };

  return (
    <EmailFormContainer>
      <EmailFormSection>
        <ActionInput
          placeholder="Enter email address"
          label="Email"
          onActionPress={handleSendCode}
          isActionSuccess={isCodeSent}
          actionLabelText="Send"
          registerField="email"
          actionDisabled={!isEmailValid || !isChecked}
          isActionLoading={isCheckEmailLoading || isSendCodeLoading}
        />
        <ErrorMessage message={emailError || checkEmailError} />
      </EmailFormSection>
      <EmailFormSection>
        <ActionInput
          placeholder="Enter Code"
          label="Code Verification"
          onActionPress={handleVerifyCode}
          isActionSuccess={isVerified}
          actionLabelText="Verify"
          registerField="verificationCode"
          actionDisabled={!isCodeValid || isVerified}
          isActionLoading={isVerifyCodeLoading}
        />
        <ErrorMessage message={codeError || verifyCodeError} />
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
