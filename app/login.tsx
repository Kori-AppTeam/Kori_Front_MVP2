import api from '@/api/axiosInstance';
import { patchLocation } from '@/api/member/location';
import AppleSignInButton from '@/components/AppleSignInButton';
import Icon from '@/components/common/Icon';
import EmailSignButton from '@/components/EmailSignButton';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { requestLocationPermission } from '@/lib/location/requestLocationPermission';
import OnboardingCarousel from '@/src/features/auth/components/OnboardingCarousel';
import { Config } from '@/src/lib/config';
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
import { ActivityIndicator, Alert, Modal, Platform, StatusBar, TouchableOpacity } from 'react-native';
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
  const router = useRouter();
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [allCheck, setAllCheck] = useState(false);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
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

    setModalVisible(false);
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
        showModal();
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
            showModal();
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
    router.push('./screens/login/GeneralLoginScreen');
  };

  const showModal = () => {
    setModalVisible(true);
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

        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <ModalOverlay activeOpacity={1}>
            <BottomSheetContent>
              <BottomSheetHeader>
                <BottomSheetHandle />
              </BottomSheetHeader>
              <BottomSheetTitle>Please agree to the terms to continue.</BottomSheetTitle>
              <AllCheckBoxContainer>
                <CheckBox
                  onPress={() => {
                    const newValue = !allCheck;
                    setAllCheck(newValue);
                    setCheck1(newValue);
                    setCheck2(newValue);
                    setCheck3(newValue);
                  }}
                >
                  <Icon type={allCheck ? 'checkMintBox' : 'box'} size={20} />
                </CheckBox>
                <AllCheckText>I agree to all.</AllCheckText>
              </AllCheckBoxContainer>
              <Divider />
              <CheckBoxContainer>
                <CheckBox onPress={() => setCheck1(!check1)}>
                  <Icon type={check1 ? 'checkMintBox' : 'box'} size={20} />
                </CheckBox>
                <CheckText>(Required) I am over 14 years old.</CheckText>
              </CheckBoxContainer>
              <CheckBoxContainer>
                <CheckBox onPress={() => setCheck2(!check2)}>
                  <Icon type={check2 ? 'checkMintBox' : 'box'} size={20} />
                </CheckBox>
                <CheckText>(Required) Terms & Conditions</CheckText>
                <TouchableOpacity onPress={showTermsAndConditions}>
                  <Icon type="next" size={20} color={theme.colors.gray.gray_1} />
                </TouchableOpacity>
              </CheckBoxContainer>
              <CheckBoxContainer>
                <CheckBox onPress={() => setCheck3(!check3)}>
                  <Icon type={check3 ? 'checkMintBox' : 'box'} size={20} />
                </CheckBox>
                <CheckText>(Required) Privacy Policy</CheckText>
                <TouchableOpacity onPress={showPrivacyPolicy}>
                  <Icon type="next" size={20} color={theme.colors.gray.gray_1} />
                </TouchableOpacity>
              </CheckBoxContainer>
              <ConfirmButton disabled={!allCheck} allCheck={allCheck} onPress={confirmAndGoSetProfilePage}>
                <ConfirmText>Confirm</ConfirmText>
              </ConfirmButton>
            </BottomSheetContent>
          </ModalOverlay>
        </Modal>
      </Container>
    </SafeArea>
  );
};

export default LoginScreen;

const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #1d1e1f;
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

const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const BottomSheetContent = styled.View`
  background-color: #353637;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  max-height: 60%;
  padding-bottom: 40px;
`;

const BottomSheetHeader = styled.View`
  align-items: center;
  padding: 15px 20px 10px 20px;
`;

const BottomSheetHandle = styled.View`
  width: 45px;
  height: 6px;
  background-color: #949899;
  border-radius: 2px;
  margin-bottom: 16px;
`;

const BottomSheetTitle = styled.Text`
  color: #ffffff;
  font-size: 15px;
  font-family: PlusJakartaSans_600SemiBold;
  margin-left: 30px;
`;

const AllCheckBoxContainer = styled.View`
  height: 60px;
  margin: 20px 5px 10px 5px;
  flex-direction: row;
  padding-left: 20px;
  align-items: center;
`;
const AllCheckText = styled.Text`
  color: #ffffff;
  font-size: 15px;
  font-family: PlusJakartaSans_600SemiBold;
  margin-left: 15px;
`;

const Divider = styled.View`
  width: 90%;
  align-self: center;
  height: 2px;
  background-color: #616262;
  margin-bottom: 10px;
`;

const CheckBoxContainer = styled.View`
  height: 50px;
  margin: 5px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 15px;
`;

const CheckBox = styled.TouchableOpacity`
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
`;
const CheckText = styled.Text`
  color: #ffffff;
  font-size: 13px;
  font-family: PlusJakartaSans_500Medium;
  margin-left: 15px;
  flex: 1;
`;

const ConfirmButton = styled.TouchableOpacity<{ allCheck: boolean }>`
  opacity: ${(props) => (props.allCheck ? 1 : 0.5)};
  background-color: #02f59b;
  height: 50px;
  width: 90%;
  align-self: center;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin: 20px 0px;
`;

const ConfirmText = styled.Text`
  color: #1d1e1f;
  font-size: 15px;
  font-family: PlusJakartaSans_500Medium;
`;
