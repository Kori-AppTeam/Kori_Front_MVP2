import React, { useEffect } from 'react';
import { onboardingImageAssets } from '@/src/features/onboarding/constants/assets';
import OnboardingCarousel from '@/src/features/onboarding/components/OnboardingCarousel';
import { usePreloadAssets } from '@/src/shared/hooks/usePreloadAssets';
import DetailHeader from '@/components/common/DetailHeader';
import { AUTH_ROUTE } from '@/src/shared/constants/route';
import { router } from 'expo-router';
import styled from 'styled-components/native';
import { theme } from '@/src/styles/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ONBOARDING_CAROUSEL_DATA } from '@/src/features/onboarding/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const index = () => {
  const { isReady: isAssetsReady } = usePreloadAssets(onboardingImageAssets);

  const onboardingData = ONBOARDING_CAROUSEL_DATA.map((item, index) => ({
    ...item,
    image: onboardingImageAssets[index],
  }));

  useEffect(() => {
    AsyncStorage.setItem('ONBOARDING_VISITED', 'true');
  }, []);

  // 에셋을 불러오기 전까지 로딩 화면 표시
  if (!isAssetsReady) {
    return null;
  }

  return (
    <SafeArea edges={[]}>
      <DetailHeader
        title=""
        isBackButtonVisible={false}
        buttonType="text"
        buttonText="Skip"
        onButtonPress={() => router.push(AUTH_ROUTE)}
      />
      <Contents>
        <OnboardingCarousel onboardingData={onboardingData} />
      </Contents>
    </SafeArea>
  );
};

const SafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.primary.black};
`;

const Contents = styled.View`
  width: 100%;
  height: 100%;
  flex: 1;
  margin-top: 20px;
`;

export default index;
