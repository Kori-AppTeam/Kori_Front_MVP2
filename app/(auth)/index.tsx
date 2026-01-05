import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StatusBar } from 'react-native';
import styled from 'styled-components/native';

import ConfirmTermsBottomSheet from '@/src/features/auth/components/ConfirmTermsBottomSheet';
import OnboardingCarousel from '@/src/features/auth/components/OnboardingCarousel';
import { useConfirmTermsBottomSheet } from '@/src/features/auth/hooks/useConfirmTermsBottomSheet';
import SignInButtonWrapper from '@/src/features/auth/components/SignInButtonWrapper';
import { usePreloadAssets } from '@/src/shared/hooks/usePreloadAssets';
import { onboardingImageAssets } from '@/src/features/auth/constants/assets';

const index = () => {
  const { bottomSheetRef, handleBottomSheetOpen, handleBottomSheetClose } = useConfirmTermsBottomSheet();
  const [loginProvider, setLoginProvider] = useState<'apple' | 'google' | null>(null);
  const { isReady: isAssetsReady } = usePreloadAssets(onboardingImageAssets);

  // 소셜 회원가입 성공 시 콜백 함수
  const onSuccessSocialSignIn = useCallback((provider: 'apple' | 'google') => {
    setLoginProvider(provider);
    handleBottomSheetOpen();
  }, []);

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
        bottomSheetClose={handleBottomSheetClose}
        loginProvider={loginProvider!}
      />
    </SafeArea>
  );
};

export default index;

const SafeArea = styled.SafeAreaView`
  flex: 1;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary.black};
`;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary.black};
`;
