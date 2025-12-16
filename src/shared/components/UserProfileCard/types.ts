// components/UserProfileCard/types.ts

import { User } from '../../types/user';

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

export interface UserProfileCardProps {
  user: User;
  actions?: UserProfileActions;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}
