import React from 'react';
import { router } from 'expo-router';
import DetailHeader from '@/components/common/DetailHeader';
import StepIndicator from '@/src/features/profile-setup/components/StepIndicator';
import { PROFILE_SETUP_TITLES } from '@/src/features/profile-setup/constants/constants';
import { Contents, SafeArea, StepContainer, SubTitle, Title } from '@/src/features/profile-setup/styles/styles';
import CustomButton from '@/src/shared/components/CustomButton';
import AboutMeStep from '@/src/features/profile-setup/components/AboutMeStep/AboutMeStep';

const index = () => {
  const step = 'aboutMe';
  return (
    <SafeArea>
      <DetailHeader title="" />
      <Contents>
        <StepIndicator step={step} />
        <Title>{PROFILE_SETUP_TITLES[step].title}</Title>
        <SubTitle>{PROFILE_SETUP_TITLES[step].subtitle}</SubTitle>

        <StepContainer>
          <AboutMeStep />
        </StepContainer>

        <CustomButton label={'next'} disabled={false} onPress={() => router.push('/profile-setup/profile-photo')} />
      </Contents>
    </SafeArea>
  );
};

export default index;
