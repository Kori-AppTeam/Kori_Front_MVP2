import React from 'react';
import { Stack } from 'expo-router';
import { FormProvider, useForm } from 'react-hook-form';
import StepPageLayout from '@/src/features/profile-setup/components/StepPageLayout';

export default function ProfileSetupStackLayout() {
  const methods = useForm({
    mode: 'onChange',
    shouldUnregister: false,
  });

  return (
    <FormProvider {...methods}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </FormProvider>
  );
}
