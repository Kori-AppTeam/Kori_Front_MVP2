// src/features/auth/hooks/useEmailSignUpForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpFormValues } from '@/src/features/auth/types';
import { signUpSchema } from '@/src/features/auth/utils/schema';

export function useEmailSignUpForm() {
  return useForm<SignUpFormValues>({
    mode: 'onChange',
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      verificationCode: '',
    },
  });
}
