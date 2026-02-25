import { Alert } from 'react-native';

type Params = {
  onConfirm: () => void;
};

export function showProfileSetupLogoutAlert({ onConfirm }: Params) {
  Alert.alert(
    'Profile setup required',
    'You need to complete your profile setup to use the service. You will be logged out now.',
    [
      {
        text: 'OK',
        onPress: onConfirm,
      },
    ],
  );
}
