import { ProfileSetupFormValues } from '@/src/features/profile-setup/types';
import { patchProfileSetup } from '@/src/features/profile-setup/api/profile';
import { profileSetupSchema } from '@/src/features/profile-setup/utils/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

export const useProfileSetupForm = () => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const methods = useForm<ProfileSetupFormValues>({
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

  const submitForm = useCallback(async () => {
    setIsSubmitLoading(true);
    try {
      return await methods.handleSubmit(
        async (values) => {
          await patchProfileSetup(values);
        },
        () => {
          throw new Error('PROFILE_SETUP_FORM_INVALID');
        },
      )();
    } finally {
      setIsSubmitLoading(false);
    }
  }, [methods]);

  return Object.assign(methods, { submitForm, isSubmitLoading });
};
