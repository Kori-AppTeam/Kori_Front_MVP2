/* eslint-disable react-native/no-inline-styles */
import queryClient from '@/api/queryClient';
import { useAutoLogin } from '@/src/features/auth/hooks/useAutoLogin';
import { initGoogleAuth } from '@/src/features/auth/lib/oauth/google';
import MoreBottomSheet from '@/src/features/community/post/components/elements/footer/MoreBottomSheet';
import ReportModal from '@/src/features/community/post/components/ReportModal';
import { useBackgroundNotification } from '@/src/features/notification/hooks/useBackgroundNotiification';
import { useForegroundNotification } from '@/src/features/notification/hooks/useForegroundNotification';
import { AUTH_ROUTE } from '@/src/shared/constants/route';
import { toastConfig } from '@/src/shared/constants/toast';
import { useCheckAppVersion } from '@/src/shared/hooks/useCheckAppVersion';
import { useScreenChangeTracker } from '@/src/shared/hooks/useScreenChangeTracker';
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
import { useFonts } from 'expo-font';
import { Stack, useNavigationContainerRef, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from 'styled-components/native';
import { ProfileProvider } from './contexts/ProfileContext';

SplashScreen.preventAutoHideAsync().catch(() => {}); // 스플래시 스크린 자동 숨김 방지

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
  const { isLoggedIn, isLoading: isAutoLoginLoading } = useAutoLogin(loaded);
  const { isLoading: isVersionCheckLoading, isAppUpToDate } = useCheckAppVersion();

  const navigationRef = useNavigationContainerRef();
  useScreenChangeTracker(navigationRef); // 화면 전환 시 Analytics 트래킹

  useForegroundNotification(isLoggedIn, pathname); // 포그라운드 알림 수신
  useBackgroundNotification(isLoggedIn, isAutoLoginLoading); // 백그라운드 알림 수신

  useEffect(() => {
    if (
      !loaded || // 폰트가 로드되지 않았거나,
      isAutoLoginLoading || // 자동 로그인 중이거나,
      isVersionCheckLoading || // 버전 확인 중이거나,
      !isAppUpToDate // 버전 업데이트가 필요한 경우 return
    ) {
      return;
    }

    // 앱 초기화 단계 완료 후 스플래시 스크린 hide
    SplashScreen.hideAsync().catch(() => {});

    // 로그인 상태에 따라 라우팅
    if (isLoggedIn) {
      initializeStomp();
      router.replace('/(tabs)');
    } else {
      router.replace(AUTH_ROUTE);
    }
  }, [loaded, isAutoLoginLoading, isLoggedIn, isVersionCheckLoading, isAppUpToDate, router]);

  if (!loaded || isAutoLoginLoading || isVersionCheckLoading || !isAppUpToDate) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <SafeAreaProvider>
            <BottomSheetModalProvider>
              <AppLayout>
                <ProfileProvider>
                  {/* 모든 화면을 항상 선언하고, 실제 이동은 위의 useEffect가 담당합니다. */}
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <Toast config={toastConfig} topOffset={80} />
                </ProfileProvider>
                {/* 커뮤니티 관련 모달 - 전역에서 사용, 로그인 상태에 따라 조건부 렌더링*/}
                {isLoggedIn && <MoreBottomSheet />}
                {isLoggedIn && <ReportModal />}
              </AppLayout>
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
