// components/UserProfileCard/types.ts

export type Gender = 'Male' | 'Female' | 'Unspecified';

export interface ActionButton {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface UserProfileActions {
  primary?: ActionButton;
  secondary?: ActionButton;
  decline?: ActionButton;
  chat?: ActionButton;
}

export interface UserProfileData {
  userId: number;
  firstname: string;
  lastname: string;
  gender: string;
  birthday: number;
  country: string;
  introduction: string;
  purpose: string;
  email: string;
  language: string[];
  hobby: string[];
  imageKey: string;
}

export interface UserProfileCardProps {
  user: UserProfileData;
  actions?: UserProfileActions;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  footerSlot?: React.ReactNode;
}
