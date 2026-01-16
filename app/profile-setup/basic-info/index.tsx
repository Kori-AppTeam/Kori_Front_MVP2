import DetailHeader from '@/components/common/DetailHeader';
import BasicInfoStep from '@/src/features/profile-setup/components/BasicInfoStep/BasicInfoStep';
import StepIndicator from '@/src/features/profile-setup/components/StepIndicator';
import { PROFILE_SETUP_TITLES } from '@/src/features/profile-setup/constants/constants';
import { Contents, SafeArea, StepContainer, SubTitle, Title } from '@/src/features/profile-setup/styles/styles';
import CustomButton from '@/src/shared/components/CustomButton';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import type { ProfileSetupFormValues } from '@/src/features/profile-setup/types';
import { profileSetupStepSchemas } from '@/src/features/profile-setup/utils/schema';
import { getProfileOptions } from '@/src/features/profile-setup/api/options';

const index = () => {
  const step = 'basicInfo';
  const values = useWatch<ProfileSetupFormValues>() ?? ({} as ProfileSetupFormValues);
  const nextDisabled = !profileSetupStepSchemas[step].safeParse(values).success;

  // useEffect(() => {
  //   const getOptions = async () => {
  //     const response = await getProfileOptions();
  //     console.log('Profile Options:', response);
  //   };

  //   getOptions();
  // }, []);

  return (
    <SafeArea>
      <DetailHeader title="" />
      <Contents>
        <StepIndicator step={step} />
        <Title>{PROFILE_SETUP_TITLES[step].title}</Title>
        <SubTitle>{PROFILE_SETUP_TITLES[step].subtitle}</SubTitle>

        <StepContainer>
          <BasicInfoStep />
        </StepContainer>

        <CustomButton label={'Next'} disabled={nextDisabled} onPress={() => router.push('/profile-setup/interests')} />
      </Contents>
    </SafeArea>
  );
};

export default index;
