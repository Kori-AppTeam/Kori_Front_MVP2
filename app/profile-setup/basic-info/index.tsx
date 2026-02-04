import DetailHeader from '@/components/common/DetailHeader';
import BasicInfoStep from '@/src/features/profile-setup/components/BasicInfoStep/BasicInfoStep';
import StepIndicator from '@/src/features/profile-setup/components/StepIndicator';
import { PROFILE_SETUP_TITLES } from '@/src/features/profile-setup/constants/constants';
import { Contents, SafeArea, StepContainer, SubTitle, Title } from '@/src/features/profile-setup/styles/styles';
import CustomButton from '@/src/shared/components/CustomButton';
import { router } from 'expo-router';
import React from 'react';
import { useWatch } from 'react-hook-form';
import type { ProfileSetupFormValues } from '@/src/features/profile-setup/types';
import { profileSetupStepSchemas } from '@/src/features/profile-setup/utils/schema';
import { PROFILE_SETUP_ROUTE } from '@/src/shared/constants/route';
import { forceLogoutWithProfileSetupAlert } from '@/src/features/profile-setup/lib/forceLogoutWithProfileSetupAlert';

const index = () => {
  const step = 'basicInfo';
  const values = useWatch<ProfileSetupFormValues>() ?? ({} as ProfileSetupFormValues);
  const nextDisabled = !profileSetupStepSchemas[step].safeParse(values).success;

  return (
    <SafeArea>
      <DetailHeader title="" onBackPress={forceLogoutWithProfileSetupAlert} />
      <Contents>
        <StepIndicator step={step} />
        <Title>{PROFILE_SETUP_TITLES[step].title}</Title>
        <SubTitle>{PROFILE_SETUP_TITLES[step].subtitle}</SubTitle>

        <StepContainer>
          <BasicInfoStep />
        </StepContainer>

        <CustomButton
          label={'Next'}
          disabled={nextDisabled}
          onPress={() => router.push(PROFILE_SETUP_ROUTE.INTERESTS)}
        />
      </Contents>
    </SafeArea>
  );
};

export default index;
