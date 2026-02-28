import * as SecureStore from 'expo-secure-store';
import type { UseFormReturn } from 'react-hook-form';
import type { ProfileSetupFormValues, ProfileSetupPrefill } from '@/src/features/profile-setup/types';

export const savePrefill = async (params: { userId: string | number; prefill: ProfileSetupPrefill }) => {
  const hasAny = !!(
    params.prefill.firstname ||
    params.prefill.lastname ||
    params.prefill.email ||
    params.prefill.gender
  );
  if (!hasAny) return;

  await SecureStore.setItemAsync(`PROFILE_SETUP_PREFILL_${params.userId}`, JSON.stringify(params.prefill), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

async function readPrefill(userId: string | number): Promise<ProfileSetupPrefill | null> {
  const raw = await SecureStore.getItemAsync(`PROFILE_SETUP_PREFILL_${userId}`);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ProfileSetupPrefill;
    return parsed;
  } catch {
    return null;
  }
}

export async function hydratePrefill(methods: UseFormReturn<ProfileSetupFormValues>) {
  const myUserId = await SecureStore.getItemAsync('MyuserId');
  if (!myUserId) return;

  const prefill = await readPrefill(myUserId);
  if (!prefill) return;

  const current = methods.getValues();

  if (typeof prefill.firstname === 'string' && current.firstname.trim().length === 0) {
    methods.setValue('firstname', prefill.firstname, { shouldDirty: false, shouldValidate: true });
  }
  if (typeof prefill.lastname === 'string' && current.lastname.trim().length === 0) {
    methods.setValue('lastname', prefill.lastname, { shouldDirty: false, shouldValidate: true });
  }
  if (typeof prefill.email === 'string' && current.email.trim().length === 0) {
    methods.setValue('email', prefill.email, { shouldDirty: false, shouldValidate: true });
  }
  if (prefill.gender === 'Male' || prefill.gender === 'Female' || prefill.gender === 'Other') {
    methods.setValue('gender', prefill.gender, { shouldDirty: false, shouldValidate: true });
  }
}
