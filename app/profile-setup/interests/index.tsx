import React from 'react';
import { router } from 'expo-router';
import DetailHeader from '@/components/common/DetailHeader';
import InterestsStep from '@/src/features/profile-setup/components/InterestsStep/InterestsStep';
import StepIndicator from '@/src/features/profile-setup/components/StepIndicator';
import { PROFILE_SETUP_TITLES } from '@/src/features/profile-setup/constants/constants';
import { Contents, SafeArea, StepContainer, SubTitle, Title } from '@/src/features/profile-setup/styles/styles';
import CustomButton from '@/src/shared/components/CustomButton';
import { useWatch } from 'react-hook-form';
import type { ProfileSetupFormValues } from '@/src/features/profile-setup/types';
import { profileSetupStepSchemas } from '@/src/features/profile-setup/utils/schema';
import { PROFILE_SETUP_ROUTE } from '@/src/shared/constants/route';

const index = () => {
  const step = 'interests';
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
          <InterestsStep />
        </StepContainer>

        <CustomButton
          label={'Next'}
          disabled={nextDisabled}
          onPress={() => router.push(PROFILE_SETUP_ROUTE.PROFILE_PHOTO)}
        />
      </Contents>
    </SafeArea>
  );
};

export default index;
