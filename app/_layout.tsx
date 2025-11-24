/* eslint-disable react-native/no-inline-styles */
import queryClient from '@/api/queryClient';
import { initGoogleAuth } from '@/src/features/auth/lib/oauth/google';
import { useBackgroundNotification } from '@/src/features/notification/hooks/useBackgroundNotiification';
import { useForegroundNotification } from '@/src/features/notification/hooks/useForegroundNotification';
import { AUTH_ROUTE } from '@/src/shared/constants/route';
import { toastConfig } from '@/src/shared/constants/toast';
import { initializeStomp } from '@/src/store/useStompStore';
import { theme } from '@/src/styles/theme';
import { InstrumentSerif_400Regular } from '@expo-google-fonts/instrument-serif';
import {
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { useFonts } from 'expo-font';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from 'styled-components/native';
import { ProfileProvider } from './contexts/ProfileContext';
SplashScreen.preventAutoHideAsync().catch(() => {});

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'index',
};

initGoogleAuth(); // 앱 시작 시 구글 인증 초기화

function AppLayout({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    // eslint-disable-next-line react-native/no-color-literals
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#1D1E1F' }}>
      {children}
    </View>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    PlusJakartaSans_300Light,
    InstrumentSerif_400Regular,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const pathname = usePathname();
  const router = useRouter();
  const [checkingToken, setCheckingToken] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAndRefreshToken = useCallback(async () => {
    try {
      console.log('1. 자동 로그인 시도...');
      const refreshToken = await SecureStore.getItemAsync('refresh');
      console.log('2. 저장된 리프레시 토큰:', refreshToken);
      if (!refreshToken) {
        setIsLoggedIn(false);
        return;
      }

      console.log('3. 서버 URL:', `${process.env.EXPO_PUBLIC_SERVER_URL}/api/v1/member/refresh`);
      const res = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/v1/member/refresh`, { refreshToken });
      console.log('4. 서버 응답 성공:', res.data); // ⭐️ 이 로그를 확인하세요
      const { accessToken, refreshToken: newRefreshToken, userId } = res.data.data;

      await SecureStore.setItemAsync('jwt', accessToken);
      await SecureStore.setItemAsync('refresh', newRefreshToken);
      await SecureStore.setItemAsync('MyuserId', userId.toString());

      setIsLoggedIn(true);
      console.log('5. 자동 로그인 성공!');
    } catch (error) {
      console.error('❌ 자동 로그인 실패:', error); // ⭐️ 이 로그가 뜬다면 실패한 것입니다.
      setIsLoggedIn(false);
    } finally {
      setCheckingToken(false);
      SplashScreen.hideAsync().catch(() => {});
    }
  }, []);

  // 👇 [수정됨] checkAndRefreshToken을 호출하는 useEffect가 이제 하나만 남았습니다.
  useEffect(() => {
    if (loaded) checkAndRefreshToken();
  }, [loaded, checkAndRefreshToken]);

  useEffect(() => {
    // 폰트가 로드 안 됐거나, 토큰 확인 중이면 아무것도 안 함 (스플래시 스크린 계속 표시)
    if (!loaded || checkingToken) {
      return;
    }

    // 토큰 확인이 끝났을 때
    if (isLoggedIn) {
      // 로그인이 되어있으면 (tabs) 메인 화면으로 이동
      router.replace('/(tabs)');
    } else {
      // 로그인이 안 되어있으면 login 화면으로 이동
      router.replace(AUTH_ROUTE);
    }
  }, [loaded, checkingToken, isLoggedIn, router]); // 이 상태들이 바뀔 때마다 실행

  useForegroundNotification(isLoggedIn, pathname); // 포그라운드 알림 수신
  useBackgroundNotification(isLoggedIn, checkingToken); // 백그라운드 알림 수신

  if (!loaded || checkingToken) return null;

  initializeStomp(); // STOMP 초기화 함수 호출

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <AppLayout>
              <ProfileProvider>
                <QueryClientProvider client={queryClient}>
                  {/* 모든 화면을 항상 선언하고, 실제 이동은 위의 useEffect가 담당합니다. */}
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <Toast config={toastConfig} topOffset={80} />
                </QueryClientProvider>
              </ProfileProvider>
            </AppLayout>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
