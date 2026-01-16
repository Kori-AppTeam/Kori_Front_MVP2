import React, { use } from 'react';
import { Stack } from 'expo-router';
import { FormProvider, useForm } from 'react-hook-form';
import { useProfileSetupForm } from '@/src/features/profile-setup/hooks/useProfileSetupForm';

export default function ProfileSetupStackLayout() {
  const methods = useProfileSetupForm();

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
