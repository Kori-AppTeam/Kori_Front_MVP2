export type ProfileSetupStep = 'basicInfo' | 'profilePhoto' | 'interests' | 'aboutMe';

export type PresignedInfo = {
  key: string;
  putUrl: string;
  headers: Record<string, string>;
};
