import { z } from 'zod';
import { PASSWORD_VALIDATIONS } from '@/src/features/auth/constants/validation';

export const signUpSchema = z
  .object({
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format.'),
    verificationCode: z.string().min(1, 'Please enter the verification code.'),
    password: z.string().superRefine((val, ctx) => {
      PASSWORD_VALIDATIONS.forEach((validation) => {
        if (!validation.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: validation.message,
          });
        }
      });
    }),
    passwordConfirm: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Your passwords do not match.',
    path: ['passwordConfirm'],
  });
