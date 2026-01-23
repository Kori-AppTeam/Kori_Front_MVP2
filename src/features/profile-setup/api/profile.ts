import api from '@/api/axiosInstance';
import { ProfileSetupFormValues } from '@/src/features/profile-setup/types';

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
