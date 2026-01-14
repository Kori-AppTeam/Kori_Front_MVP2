import DetailHeader from '@/components/common/DetailHeader';
import BasicInfoStep from '@/src/features/profile-setup/components/BasicInfoStep/BasicInfoStep';
import StepIndicator from '@/src/features/profile-setup/components/StepIndicator';
import StepPageLayout from '@/src/features/profile-setup/components/StepPageLayout';
import { PROFILE_SETUP_TITLES } from '@/src/features/profile-setup/constants/constants';
import { Contents, SafeArea, StepContainer, SubTitle, Title } from '@/src/features/profile-setup/styles/styles';
import CustomButton from '@/src/shared/components/CustomButton';
import { router } from 'expo-router';
import React from 'react';

const index = () => {
  const step = 'basicInfo';
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

        <CustomButton label={'next'} disabled={false} onPress={() => router.push('/profile-setup/interests')} />
      </Contents>
    </SafeArea>
  );
};

export default index;
