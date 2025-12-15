export type User = {
  userId: string;
  firstname: string;
  lastname: string;
  gender: string;
  birthday: string;
  country: string;
  introduction: string;
  purpose: string;
  language: string[];
  hobby: string[];
  imageKey: string;
  followStatus?: string;
};
