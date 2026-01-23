import React from 'react';
import { router } from 'expo-router';
import DetailHeader from '@/components/common/DetailHeader';
import InterestsStep from '@/src/features/profile-setup/components/InterestsStep/InterestsStep';
import StepIndicator from '@/src/features/profile-setup/components/StepIndicator';
import { PROFILE_SETUP_TITLES } from '@/src/features/profile-setup/constants/constants';
import { Contents, SafeArea, StepContainer, SubTitle, Title } from '@/src/features/profile-setup/styles/styles';
import CustomButton from '@/src/shared/components/CustomButton';
import ProfilePhotoStep from '@/src/features/profile-setup/components/ProfilePhotoStep/ProfilePhotoStep';
import { useWatch } from 'react-hook-form';
import type { ProfileSetupFormValues } from '@/src/features/profile-setup/types';
import { profileSetupStepSchemas } from '@/src/features/profile-setup/utils/schema';
import { PROFILE_SETUP_ROUTE } from '@/src/shared/constants/route';

const index = () => {
  const step = 'profilePhoto';
  const values = useWatch<ProfileSetupFormValues>() ?? ({} as ProfileSetupFormValues);
  const nextDisabled = !profileSetupStepSchemas[step].safeParse(values).success;

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

        <CustomButton
          label={'Next'}
          disabled={nextDisabled}
          onPress={() => router.push(PROFILE_SETUP_ROUTE.ABOUT_ME)}
        />
      </Contents>
    </SafeArea>
  );
};

export default index;
