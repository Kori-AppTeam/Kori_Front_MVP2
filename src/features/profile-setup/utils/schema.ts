import { z } from 'zod';
import type { ProfileSetupStep, ProfileSetupFormValues } from '@/src/features/profile-setup/types';

export const profileSetupSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  gender: z.enum(['Male', 'Female', 'Other']),
  birthday: z.string().min(1),
  country: z.string().min(1),
  introduction: z.string().min(1),
  purpose: z.string().min(1),
  email: z.string().min(1),
  language: z.array(z.string().min(1)).min(1),
  hobby: z.array(z.string().min(1)).min(1),
  imageKey: z.string().min(1),
});

export type ProfileSetupSchema = z.infer<typeof profileSetupSchema>;

// 각 스텝별 필드 매핑
export const PROFILE_SETUP_STEP_FIELDS = {
  basicInfo: ['firstname', 'lastname', 'gender', 'birthday', 'country', 'language'] as const,
  interests: ['hobby'] as const,
  profilePhoto: ['imageKey'] as const,
  aboutMe: ['introduction'] as const,
} satisfies Record<ProfileSetupStep, readonly (keyof ProfileSetupFormValues)[]>;

// 각 스텝별 유효성 검사 스키마
export const profileSetupStepSchemas = {
  basicInfo: profileSetupSchema.pick({
    firstname: true,
    lastname: true,
    gender: true,
    birthday: true,
    country: true,
    language: true,
  }),
  interests: profileSetupSchema.pick({
    hobby: true,
  }),
  profilePhoto: profileSetupSchema.pick({
    imageKey: true,
  }),
  aboutMe: profileSetupSchema.pick({
    introduction: true,
  }),
} satisfies Record<ProfileSetupStep, z.ZodTypeAny>;
