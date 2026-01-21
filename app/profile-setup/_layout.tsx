import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { FormProvider } from 'react-hook-form';
import { useProfileSetupForm } from '@/src/features/profile-setup/hooks/useProfileSetupForm';
import { useHydratePrefill } from '@/src/features/profile-setup/hooks/useHydrateProfile';

export default function ProfileSetupStackLayout() {
  const methods = useProfileSetupForm();

  useHydratePrefill(methods);

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
