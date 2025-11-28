import DetailHeader from '@/components/common/DetailHeader';
import ConfirmTermsBottomSheet from '@/src/features/auth/components/ConfirmTermsBottomSheet';
import EmailForm from '@/src/features/auth/components/EmailForm';
import PasswordForm from '@/src/features/auth/components/PasswordForm';
import { useCheckEmail } from '@/src/features/auth/hooks/useCheckEmail';
import { useConfirmTermsBottomSheet } from '@/src/features/auth/hooks/useConfirmTermsBottomSheet';
import { useEmailSignUp } from '@/src/features/auth/hooks/useEmailSignUp';
import { useEmailSignUpForm } from '@/src/features/auth/hooks/useEmailSignUpForm';
import { useVerifyEmail } from '@/src/features/auth/hooks/useVerifyEmail';
import CustomButton from '@/src/shared/components/CustomButton';
import { SIGNUP_DONE_ROUTE, SIGNUP_ROUTE } from '@/src/shared/constants/route';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import styled from 'styled-components/native';

const index = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isNextButtonClicked, setIsNextButtonClicked] = useState<boolean>(false);
  const { bottomSheetRef, handleBottomSheetClose, handleBottomSheetOpen } = useConfirmTermsBottomSheet();

  const methods = useEmailSignUpForm();
  const checkEmailHook = useCheckEmail(methods.watch('email'), methods.formState.errors.email?.message as string);
  const verifyEmailHook = useVerifyEmail(methods.watch('email'));
  const { isLoading: isEmailSignUpLoading, emailSignUp } = useEmailSignUp();

  const handleEmailSignUp = async () => {
    try {
      await emailSignUp(methods.getValues());

      handleBottomSheetClose();
      setTimeout(() => {
        router.replace(SIGNUP_DONE_ROUTE);
      }, 500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to sign up.',
        text2: 'Please try again later.',
        position: 'bottom',
        bottomOffset: 180,
      });
      router.back();
    }
  };

  const showModal = () => {
    setIsNextButtonClicked(true); // 버튼 클릭 여부 저장
    handleBottomSheetOpen(); // Next 버튼 클릭 시 모달 열기
  };

  // next 버튼 클릭 상태에 따라 모달 열기
  useEffect(() => {
    // 회원가입 페이지가 아닌 경우 모달 닫음
    if (pathname !== SIGNUP_ROUTE) return;

    if (isNextButtonClicked) handleBottomSheetOpen();
  }, [pathname]);

  return (
    <SafeArea>
      <StatusBar barStyle="light-content" />
      <DetailHeader title="Create your account" onButtonPress={() => router.back()} />
      <Container>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} extraScrollHeight={40} enableOnAndroid={true}>
          <GeneralLoginContainer>
            <FormProvider {...methods}>
              <EmailForm useCheckEmail={checkEmailHook} useVerifyEmail={verifyEmailHook} />
              <PasswordForm />
            </FormProvider>
          </GeneralLoginContainer>
        </KeyboardAwareScrollView>

        <BottomButtonWrapper>
          <CustomButton
            label="Next"
            disabled={!methods.formState.isValid || !verifyEmailHook.isVerified}
            onPress={() => handleBottomSheetOpen()}
          />
        </BottomButtonWrapper>
      </Container>
      {/* 약관 동의 바텀시트 */}
      <ConfirmTermsBottomSheet
        bottomSheetClose={() => handleBottomSheetClose()}
        bottomSheetRef={bottomSheetRef}
        loginProvider="email"
        onPress={() => handleEmailSignUp()}
        isLoading={isEmailSignUpLoading}
      />
    </SafeArea>
  );
};

export default index;

const SafeArea = styled.SafeAreaView`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary.black};
  padding: 0px 20px 32px 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const GeneralLoginContainer = styled.View`
  flex: 1;
  width: 100%;
  padding-bottom: 40px;
  margin-top: 24px;
`;

const BottomButtonWrapper = styled.View`
  width: 100%;
  margin-bottom: 80px;
`;
