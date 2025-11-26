import z from 'zod';
import { signUpSchema } from '@/src/features/auth/utils/schema';

export type AppLoginResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
    userId: number;
    isNewUser: boolean;
  };
  message: string;
  timestamp: string;
};

export type EmailLoginResponse = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresInMillis: number;
  userId: number;
  email: string;
  isNewUser: boolean;
};

export type SignUpFormValues = z.infer<typeof signUpSchema>;
