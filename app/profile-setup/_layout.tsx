import React from 'react';
import { Stack } from 'expo-router';
import { FormProvider } from 'react-hook-form';
import { useProfileSetupForm } from '@/src/features/profile-setup/hooks/useProfileSetupForm';
import { useHydratePrefill } from '@/src/features/profile-setup/hooks/useHydrateProfile';
import { useInitProfileOptions } from '@/src/features/profile-setup/store/useProfileOptions';

export default function ProfileSetupStackLayout() {
  const methods = useProfileSetupForm();

  useHydratePrefill(methods);
  useInitProfileOptions();

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
