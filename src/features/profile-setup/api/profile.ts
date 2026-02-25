import api from '@/api/axiosInstance';
import { ProfileSetupFormValues } from '@/src/features/profile-setup/types';

export async function getProfileSetupCompleted(): Promise<boolean> {
  const { data } = await api.get('/api/v1/member/is-completed');

  if (typeof data?.profileCompleted !== 'boolean') {
    throw new Error('INVALID_PROFILE_SETUP_COMPLETED_RESPONSE');
  }

  return data.profileCompleted;
}

export async function patchProfileSetup(data: ProfileSetupFormValues) {
  try {
    const res = await api.patch('/api/v1/member/profile/setup', data);
    console.log('patchProfileSetup response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error in patchProfileSetup:', error);
    throw error;
  }
}
