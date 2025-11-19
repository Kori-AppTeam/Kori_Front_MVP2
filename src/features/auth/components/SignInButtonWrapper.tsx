import React from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import styled from 'styled-components/native';

import { useAppleSignIn } from '@/src/features/auth/hooks/useAppleSignIn';
import { useGoogleSignIn } from '@/src/features/auth/hooks/useGoogleSignIn';
import { LOGIN_ROUTE } from '@/src/shared/constants/route';
import { textStyle } from '@/src/styles/theme';
import { resetToTabsScreen } from '@/src/features/auth/lib/resetToTabScreen';
import { alertAppleRejoinUser } from '@/src/features/auth/lib/alertRejoinAppleUser';
import SignInButton from '@/src/features/auth/components/SignInButton';

interface SignInButtonWrapperProps {
  onSuccessSocialSignIn: (provider: 'apple' | 'google') => void;
}

function SignInButtonWrapper({ onSuccessSocialSignIn }: SignInButtonWrapperProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const { isLoading: isGoogleLoading, googleSignIn } = useGoogleSignIn();
  const { isLoading: isAppleLoading, appleSignIn } = useAppleSignIn();

  async function handleAppleSignInPress() {
    try {
      const appleUserLoginCase = await appleSignIn();
      switch (appleUserLoginCase) {
        case 'normal': // 일반 로그인 유저인 경우 바로 메인 화면으로 이동
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
      console.error('error', error);
    }
  }

  async function handleGoogleSignInPress() {
    try {
      const { isNewUser } = await googleSignIn();

      if (isNewUser) {
        // 신규 유저인 경우 회원가입
        onSuccessSocialSignIn('google');
      } else {
        // 기존 유저인 경우 메인 화면으로 이동
        resetToTabsScreen(navigation);
      }
    } catch (error) {
      console.error('error', error);
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
        See how we use your data in our <HighlightText> Privacy Policy.</HighlightText>
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
