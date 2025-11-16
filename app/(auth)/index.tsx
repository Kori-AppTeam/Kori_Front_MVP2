import api from '@/api/axiosInstance';
import { patchLocation } from '@/api/member/location';
import AppleSignInButton from '@/components/AppleSignInButton';
import EmailSignButton from '@/components/EmailSignButton';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { requestLocationPermission } from '@/lib/location/requestLocationPermission';
import ConfirmTermsBottomSheet from '@/src/features/auth/components/ConfirmTermsBottomSheet';
import OnboardingCarousel from '@/src/features/auth/components/OnboardingCarousel';
import { useConfirmTermsBottomSheet } from '@/src/features/auth/hooks/useConfirmTermsBottomSheet';
import { Config } from '@/src/lib/config';
import { LOGIN_ROUTE } from '@/src/shared/constants/route';
import { theme } from '@/src/styles/theme';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { CommonActions } from '@react-navigation/native';
import axios from 'axios';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Asset } from 'expo-asset';
import { randomUUID } from 'expo-crypto';
import { useNavigation, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StatusBar } from 'react-native';
import styled from 'styled-components/native';

GoogleSignin.configure({
  webClientId: `${Config.GOOGLE_WEB_CLIENT_ID}`,
  iosClientId: `${Config.GOOGLE_IOS_CLIENT_ID}`,
  offlineAccess: true,
});

type AppLoginResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
    userId: number;
    isNewUser: boolean;
  };
  message: string;
  timestamp: string;
};

const onboardingImages = [
  require('@/assets/images/onboarding1.png'),
  require('@/assets/images/onboarding2.png'),
  require('@/assets/images/onboarding3.png'),
];

const LoginScreen = () => {
  const { bottomSheetRef, handleBottomSheetOpen, handleBottomSheetClose } = useConfirmTermsBottomSheet();
  const router = useRouter();
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [isAppleLogin, setIsAppleLogin] = useState(false);

  // ✅ 에셋 프리로드 준비 상태
  const [assetsReady, setAssetsReady] = useState(false);

  // ✅ 첫 렌더 전에 온보딩 이미지 프리로드
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await Promise.all(onboardingImages.map((src) => Asset.fromModule(src).downloadAsync()));
      } catch (e) {
        console.warn('onboarding images preload failed', e);
      } finally {
        if (mounted) setAssetsReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const confirmAndGoSetProfilePage = async () => {
    const { latitude, longitude } = await requestLocationPermission();
    await patchLocation(latitude, longitude);

    handleBottomSheetClose();
    if (isAppleLogin) {
      setIsAppleLogin(false);
      router.push('/screens/makeprofile/GenderStepScreen');
    } else {
      router.push('/screens/makeprofile/NameStepScreen');
    }
  };

  // 서버로 구글 로그인 토큰 전송
  const sendGoogleTokenToServer = async (code: string) => {
    try {
      const res = await axios.post<AppLoginResponse>(`${Config.SERVER_URL}/api/v1/member/google/app-login`, { code });

      const { accessToken, refreshToken, userId, isNewUser } = res.data.data;
      await SecureStore.setItemAsync('jwt', accessToken, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      await SecureStore.setItemAsync('refresh', refreshToken, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      await SecureStore.setItemAsync('MyuserId', userId.toString(), {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });

      if (isNewUser) {
        handleBottomSheetOpen();
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: '(tabs)' }],
          }),
        );
      }
    } catch (error) {
      console.error('서버 요청 실패', error);
    }
  };

  // 구글 로그인
  const googleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        setUserInfo({ userInfo: response.data });
        const code = response.data.serverAuthCode;
        if (!code) {
          setGoogleLoading(false);
          return;
        }
        await sendGoogleTokenToServer(code);
      } else {
        console.error('사용자가 로그인 취소');
      }
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            break;
          default:
        }
      } else {
        console.error('Google Sign-In 이외 오류', error);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // 애플 로그인
  const appleSignIn = async () => {
    try {
      setAppleLoading(true);
      const rawNonce = randomUUID();
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: rawNonce,
      });

      const res = await axios.post<AppLoginResponse>(`${Config.SERVER_URL}/api/v1/member/apple/app-login`, {
        identityToken: credential.identityToken,
        authorizationCode: credential.authorizationCode,
        nonce: rawNonce,
        email: credential.email,
        fullName: {
          givenName: credential.fullName?.givenName,
          familyName: credential.fullName?.familyName,
        },
      });

      const { accessToken, refreshToken, userId, isNewUser } = res.data.data;
      await SecureStore.setItemAsync('jwt', accessToken, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      await SecureStore.setItemAsync('refresh', refreshToken, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      await SecureStore.setItemAsync('MyuserId', userId.toString(), {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });

      if (isNewUser) {
        try {
          const res = await api.get(`${Config.SERVER_URL}/api/v1/member/${userId}/is-apple`);
          const { isRejoiningWithoutFullName } = res.data.data;
          if (isRejoiningWithoutFullName) {
            Alert.alert(
              'Apple Sign-In Not Completed!',
              [
                'Go to iOS Settings → [Your Name/Apple ID]  → Password & Security → Sign in with Apple',
                'find this app, and disconnect it.',
                'Then return to the app and sign up again to complete the process',
              ].join('\n'),
              [{ text: 'OK', onPress: () => console.log('ok') }],
            );
          } else {
            handleBottomSheetOpen();
            setIsAppleLogin(true);
          }
        } catch (error) {
          console.error('error', error);
        }
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: '(tabs)' }],
          }),
        );
      }
    } catch (e: any) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
      } else {
        console.error('에러코드', e);
      }
    } finally {
      setAppleLoading(false);
    }
  };

  const goEmailLoginScreen = async () => {
    router.push(LOGIN_ROUTE);
  };

  // ✅ 프리로드가 끝나기 전에는 로딩 UI
  if (!assetsReady) {
    return (
      <SafeArea>
        <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </Container>
      </SafeArea>
    );
  }

  return (
    <>
      <SafeArea>
        <StatusBar barStyle="light-content" />
        <Container>
          <OnboardingCarousel onboardingImages={onboardingImages} />

          {/* 로그인 버튼 영역 */}
          <ButtonContainer>
            {Platform.OS === 'ios' ? (
              <AppleSignInButton onPress={appleSignIn} loading={appleLoading} />
            ) : (
              <GoogleSignInButton onPress={googleSignIn} loading={googleLoading} />
            )}
            <EmailSignButton onPress={goEmailLoginScreen} />
            <SmallText>
              By singing up, you agree to our Terms.{'\n'}
              See how we use your data in our <HighlightText> Privacy Policy.</HighlightText>
            </SmallText>
          </ButtonContainer>
        </Container>

        <ConfirmTermsBottomSheet
          ref={bottomSheetRef}
          onConfirmPress={() => confirmAndGoSetProfilePage()}
          bottomSheetClose={handleBottomSheetClose}
        />
      </SafeArea>
    </>
  );
};

export default LoginScreen;

const SafeArea = styled.SafeAreaView`
  flex: 1;
  height: 100%;
`;

const Container = styled.View`
  flex: 1;
  background-color: #1d1e1f;
`;

const ButtonContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const SmallText = styled.Text`
  color: #848687;
  font-family: PlusJakartaSans_300Light;
  font-size: 11px;
  text-align: center;
  margin-top: 10px;
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary.white};
  font-size: 12px;
  font-family: PlusJakartaSans_600SemiBold;
`;
