import { ProfileSetupFormValues } from '@/src/features/profile-setup/types';
import { profileSetupSchema } from '@/src/features/profile-setup/utils/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useProfileSetupForm = () => {
  return useForm<ProfileSetupFormValues>({
    mode: 'onChange',
    resolver: zodResolver(profileSetupSchema),
    shouldUnregister: false,
    defaultValues: {
      firstname: '',
      lastname: '',
      gender: 'Male',
      birthday: '',
      country: '',
      introduction: '',
      purpose: 'Study', // TODO 백엔드 api 수정 시 삭제 필요
      email: '',
      language: [],
      hobby: [],
      imageKey: '',
    },
  });
};
