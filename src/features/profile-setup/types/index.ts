export type ProfileSetupStep = 'basicInfo' | 'profilePhoto' | 'interests' | 'aboutMe';

export type PresignedInfo = {
  key: string;
  putUrl: string;
  headers: Record<string, string>;
};

export type ProfileSetupFormValues = {
  firstname: string;
  lastname: string;
  gender: 'Male' | 'Female' | 'Other';
  birthday: string;
  country: string;
  introduction: string;
  purpose: string; // TODO 백엔드 api 수정 시 삭제 필요
  email: string;
  language: string[];
  hobby: string[];
  imageKey: string;
};

export type ProfileSetupPrefill = Partial<Pick<ProfileSetupFormValues, 'firstname' | 'lastname' | 'email' | 'gender'>>;
