import React from 'react';
import { router } from 'expo-router';
import DetailHeader from '@/components/common/DetailHeader';
import StepIndicator from '@/src/features/profile-setup/components/StepIndicator';
import { PROFILE_SETUP_TITLES } from '@/src/features/profile-setup/constants/constants';
import { Contents, SafeArea, StepContainer, SubTitle, Title } from '@/src/features/profile-setup/styles/styles';
import CustomButton from '@/src/shared/components/CustomButton';
import AboutMeStep from '@/src/features/profile-setup/components/AboutMeStep/AboutMeStep';
import { useFormContext, useWatch } from 'react-hook-form';
import type { ProfileSetupFormValues } from '@/src/features/profile-setup/types';
import { profileSetupStepSchemas } from '@/src/features/profile-setup/utils/schema';
import type { UseFormReturn } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { PROFILE_SETUP_ROUTE } from '@/src/shared/constants/route';

type ProfileSetupMethods = UseFormReturn<ProfileSetupFormValues> & {
  submitForm: () => Promise<unknown>;
  isSubmitLoading: boolean;
};

const index = () => {
  const step = 'aboutMe';
  const methods = useFormContext<ProfileSetupFormValues>() as ProfileSetupMethods;
  const values = useWatch<ProfileSetupFormValues>() ?? ({} as ProfileSetupFormValues);
  const nextDisabled = !profileSetupStepSchemas[step].safeParse(values).success;
  const { submitForm, isSubmitLoading } = methods;

  const handleSubmit = async () => {
    // 프로필 설정 완료 후 메인 화면으로 이동
    try {
      await submitForm();

      if (!isSubmitLoading) {
        router.push(PROFILE_SETUP_ROUTE.DONE);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to submit the form.',
        text2: 'Please try again.',
      });
    }
  };

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

        <CustomButton label={'Done'} disabled={nextDisabled} onPress={handleSubmit} isLoading={isSubmitLoading} />
      </Contents>
    </SafeArea>
  );
};

export default index;
