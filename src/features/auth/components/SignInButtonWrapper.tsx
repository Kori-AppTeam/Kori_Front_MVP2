import { useNavigation, useRouter } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import styled from 'styled-components/native';

import SignInButton from '@/src/features/auth/components/SignInButton';
import { APPLE_AUTH_ERROR, GOOGLE_AUTH_ERROR } from '@/src/features/auth/constants/error';
import { useAppleSignIn } from '@/src/features/auth/hooks/useAppleSignIn';
import { useGoogleSignIn } from '@/src/features/auth/hooks/useGoogleSignIn';
import { alertAppleRejoinUser } from '@/src/features/auth/lib/alertRejoinAppleUser';
import { resetToTabsScreen } from '@/src/features/auth/lib/resetToTabScreen';
import { getAuthErrorCode } from '@/src/features/auth/utils/error';
import { LOGIN_ROUTE, SIGNUP_PRIVACY_POLICY_ROUTE } from '@/src/shared/constants/route';
import { initializeStomp } from '@/src/store/useStompStore';
import { textStyle } from '@/src/styles/theme';
import { statusCodes } from '@react-native-google-signin/google-signin';

interface SignInButtonWrapperProps {
  onSuccessSocialSignIn: (provider: 'apple' | 'google') => void;
}

function SignInButtonWrapper({ onSuccessSocialSignIn }: SignInButtonWrapperProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const { isLoading: isGoogleLoading, googleSignIn } = useGoogleSignIn();
  const { isLoading: isAppleLoading, appleSignIn } = useAppleSignIn();

  /* ---------- 애플 로그인 버튼 핸들러 --------- */
  async function handleAppleSignInPress() {
    try {
      const appleUserLoginCase = await appleSignIn();
      switch (appleUserLoginCase) {
        case 'normal': // 일반 로그인 유저인 경우 바로 메인 화면으로 이동
          initializeStomp();
          resetToTabsScreen(navigation);
          return;

        case 'rejoin': // 애플 재가입 유저인 경우 alert
          alertAppleRejoinUser();
          return;

        case 'newUser': // 신규 유저인 경우 회원가입
          onSuccessSocialSignIn('apple');
          return;
      }
    } catch (error) {
      const errorCode = getAuthErrorCode(error, 'apple');
      const errorConfig = APPLE_AUTH_ERROR[errorCode];

      // 사용자가 로그인을 취소한 경우를 제외하고 error toast 표시
      if (errorConfig !== APPLE_AUTH_ERROR.ERR_REQUEST_CANCELED) {
        Toast.show({
          type: 'error',
          text1: errorConfig.message,
          text2: errorConfig.subMessage || 'Please try again later.',
        });
      }
    }
  }

  /* ---------- 구글 로그인 버튼 핸들러 --------- */
  async function handleGoogleSignInPress() {
    try {
      const { isNewUser } = await googleSignIn();

      if (isNewUser) {
        // 신규 유저인 경우 회원가입
        onSuccessSocialSignIn('google');
      } else {
        // 기존 유저인 경우 메인 화면으로 이동
        initializeStomp();
        resetToTabsScreen(navigation);
      }
    } catch (error) {
      const errorCode = getAuthErrorCode(error, 'google');
      const errorConfig = GOOGLE_AUTH_ERROR[errorCode];

      // 사용자가 로그인을 취소하거나 이미 로그인 진행중인 경우를 제외하고 error toast 표시
      if (
        errorConfig !== GOOGLE_AUTH_ERROR[statusCodes.SIGN_IN_CANCELLED] &&
        errorConfig !== GOOGLE_AUTH_ERROR[statusCodes.IN_PROGRESS]
      ) {
        Toast.show({
          type: 'error',
          text1: errorConfig.message,
          text2: 'Please try again later.',
        });
      }
    }
  }

  function handleEmailSignPress() {
    router.push(LOGIN_ROUTE);
  }

  return (
    <ButtonContainer>
      {Platform.OS === 'ios' ? (
        <SignInButton
          onPress={handleAppleSignInPress}
          loading={isAppleLoading}
          label="Continue with Apple"
          iconType="apple"
        />
      ) : (
        <SignInButton
          onPress={handleGoogleSignInPress}
          loading={isGoogleLoading}
          label="Continue with Google"
          iconType="google"
        />
      )}
      <SignInButton onPress={handleEmailSignPress} label="Continue with Email" iconType="mail" />
      <SmallText>
        By signing up, you agree to our Terms.{'\n'}
        See how we use your data in our
        <HighlightText onPress={() => router.push(SIGNUP_PRIVACY_POLICY_ROUTE)}> Privacy Policy.</HighlightText>
      </SmallText>
    </ButtonContainer>
  );
}

export default SignInButtonWrapper;

const ButtonContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const SmallText = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.small.small_L)}
  color: ${({ theme }) => theme.colors.gray.gray_1};
  text-align: center;
  margin-top: 10px;
`;

const HighlightText = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.small.small_M)}
  color: ${({ theme }) => theme.colors.primary.white};
`;
