/* eslint-disable react-native/no-inline-styles */
import queryClient from '@/api/queryClient';
import { useAutoLogin } from '@/src/features/auth/hooks/useAutoLogin';
import { initGoogleAuth } from '@/src/features/auth/lib/oauth/google';
import MoreBottomSheet from '@/src/features/community/post/components/elements/footer/MoreBottomSheet';
import ReportModal from '@/src/features/community/post/components/ReportModal';
import { useMoreSheetStore } from '@/src/features/community/post/store/useMoreSheetStore';
import { useReportSheetStore } from '@/src/features/community/post/store/useReportSheetStore';
import { useBackgroundNotification } from '@/src/features/notification/hooks/useBackgroundNotiification';
import { useForegroundNotification } from '@/src/features/notification/hooks/useForegroundNotification';
import { AUTH_ROUTE } from '@/src/shared/constants/route';
import { toastConfig } from '@/src/shared/constants/toast';
import { useCheckAppVersion } from '@/src/shared/hooks/useCheckAppVersion';
import { useScreenChangeTracker } from '@/src/shared/hooks/useScreenChangeTracker';
import { initSentry, wrapWithSentry } from '@/src/shared/utils/sentry';
import useAuthStore from '@/src/store/useAuthStore';
import { initializeStomp } from '@/src/store/useStompStore';
import { theme } from '@/src/styles/theme';
import { InstrumentSerif_400Regular } from '@expo-google-fonts/instrument-serif';
import {
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_700Bold_Italic,
} from '@expo-google-fonts/plus-jakarta-sans';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalHost, PortalProvider } from '@gorhom/portal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, useNavigationContainerRef, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from 'styled-components/native';
import { ProfileProvider } from './contexts/ProfileContext';

initSentry();

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
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: Platform.OS === 'android' ? insets.bottom : 0,
        backgroundColor: '#1D1E1F',
      }}
    >
      {children}
    </View>
  );
}

export default wrapWithSentry(function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    PlusJakartaSans_300Light,
    InstrumentSerif_400Regular,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_700Bold_Italic,
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

    const initializeApp = async () => {
      // 앱 초기화 단계 완료 후 스플래시 스크린 hide
      SplashScreen.hideAsync().catch(() => {});

      // 로그인 상태에 따라 라우팅
      if (isLoggedIn) {
        initializeStomp();
        router.replace('/(tabs)');
      } else {
        const ONBOARDING_VISITED = await AsyncStorage.getItem('ONBOARDING_VISITED');
        const isOnboardingVisited = ONBOARDING_VISITED === 'true';
        console.log(`[Onboarding] Visited status: ${isOnboardingVisited}`);

        // await AsyncStorage.removeItem('ONBOARDING_VISITED'); // --- TESTING PURPOSES ONLY ---
        if (isOnboardingVisited) {
          router.replace(AUTH_ROUTE);
        } else {
          router.replace('/onboarding');
        }
      }
    };

    initializeApp();
  }, [loaded, isAutoLoginLoading, isLoggedIn, isVersionCheckLoading, isAppUpToDate, router]);

  useEffect(() => {
    if (!isLoggedIn) {
      // 로그아웃 시 커뮤니티 모달 상태 초기화
      useMoreSheetStore.getState().resetData();
      useReportSheetStore.getState().resetData();

      // 로그아웃 시 사용자 정보 초기화
      useAuthStore.getState().setCurrentUserId(null);
    }
  }, [isLoggedIn]);

  if (!loaded || isAutoLoginLoading || isVersionCheckLoading || !isAppUpToDate) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.primary.black }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <SafeAreaProvider style={{ flex: 1, backgroundColor: theme.colors.primary.black }}>
            <PortalProvider>
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
                  <PortalHost name="dropdown" />
                </AppLayout>
              </BottomSheetModalProvider>
            </PortalProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
});
