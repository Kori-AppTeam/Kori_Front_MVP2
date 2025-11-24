import { Alert } from 'react-native';

export function alertAppleRejoinUser() {
  Alert.alert(
    'Apple Sign-In Not Completed!',
    [
      'Go to iOS Settings → [Your Name/Apple ID]  → Password & Security → Sign in with Apple',
      'find this app, and disconnect it.',
      'Then return to the app and sign up again to complete the process',
    ].join('\n'),
  );
}
