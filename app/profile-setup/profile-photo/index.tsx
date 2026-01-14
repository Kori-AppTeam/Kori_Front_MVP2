import React from 'react';
import { router } from 'expo-router';
import DetailHeader from '@/components/common/DetailHeader';
import InterestsStep from '@/src/features/profile-setup/components/InterestsStep/InterestsStep';
import StepIndicator from '@/src/features/profile-setup/components/StepIndicator';
import { PROFILE_SETUP_TITLES } from '@/src/features/profile-setup/constants/constants';
import { Contents, SafeArea, StepContainer, SubTitle, Title } from '@/src/features/profile-setup/styles/styles';
import CustomButton from '@/src/shared/components/CustomButton';
import ProfilePhotoStep from '@/src/features/profile-setup/components/ProfilePhotoStep/ProfilePhotoStep';

const index = () => {
  const step = 'profilePhoto';
  return (
    <SafeArea>
      <DetailHeader title="" />
      <Contents>
        <StepIndicator step={step} />
        <Title>{PROFILE_SETUP_TITLES[step].title}</Title>
        <SubTitle>{PROFILE_SETUP_TITLES[step].subtitle}</SubTitle>

        <StepContainer>
          <ProfilePhotoStep />
        </StepContainer>

        <CustomButton label={'next'} disabled={false} onPress={() => router.push('/profile-setup/about-me')} />
      </Contents>
    </SafeArea>
  );
};

export default index;
