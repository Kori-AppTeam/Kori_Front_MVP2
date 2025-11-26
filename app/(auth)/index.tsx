import React, { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StatusBar } from 'react-native';
import styled from 'styled-components/native';

import { patchLocation } from '@/api/member/location';
import { requestLocationPermission } from '@/lib/location/requestLocationPermission';
import ConfirmTermsBottomSheet from '@/src/features/auth/components/ConfirmTermsBottomSheet';
import OnboardingCarousel from '@/src/features/auth/components/OnboardingCarousel';
import { useConfirmTermsBottomSheet } from '@/src/features/auth/hooks/useConfirmTermsBottomSheet';
import SignInButtonWrapper from '@/src/features/auth/components/SignInButtonWrapper';
import { usePreloadAssets } from '@/src/shared/hooks/usePreloadAssets';
import { onboardingImageAssets } from '@/src/features/auth/constants/assets';

const index = () => {
  const router = useRouter();
  const { bottomSheetRef, handleBottomSheetOpen, handleBottomSheetClose } = useConfirmTermsBottomSheet();
  const [loginProvider, setLoginProvider] = useState<'apple' | 'google' | null>(null);
  const { isReady: isAssetsReady } = usePreloadAssets(onboardingImageAssets);

  // 소셜 회원가입 성공 시 콜백 함수
  const onSuccessSocialSignIn = useCallback((provider: 'apple' | 'google') => {
    setLoginProvider(provider);
    handleBottomSheetOpen();
  }, []);

  // TODO 회원가입 로직과 중복, 회원가입 리팩토링 시 같이 리팩토링 필요
  const confirmAndGoSetProfilePage = async () => {
    const { latitude, longitude } = await requestLocationPermission();
    await patchLocation(latitude, longitude);

    handleBottomSheetClose();
    if (loginProvider === 'apple') {
      router.push('/screens/makeprofile/GenderStepScreen');
    } else {
      router.push('/screens/makeprofile/NameStepScreen');
    }
  };

  // 에셋을 불러오기 전까지 로딩 화면 표시
  if (!isAssetsReady) {
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
        <OnboardingCarousel onboardingImages={onboardingImageAssets} />

        <SignInButtonWrapper
          onSuccessSocialSignIn={(provider: 'apple' | 'google') => onSuccessSocialSignIn(provider)}
        />
      </Container>

      <ConfirmTermsBottomSheet
        bottomSheetRef={bottomSheetRef}
        onConfirmPress={() => confirmAndGoSetProfilePage()}
        bottomSheetClose={handleBottomSheetClose}
      />
    </SafeArea>
  );
};

export default index;

const SafeArea = styled.SafeAreaView`
  flex: 1;
  height: 100%;
`;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary.black};
`;
