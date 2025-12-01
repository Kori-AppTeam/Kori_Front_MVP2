import { Alert, Linking } from 'react-native';

export function showUpdateAlert(title: string, message: string, storeUrl: string, isForce: boolean) {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Update',
        onPress: async () => await Linking.openURL(storeUrl),
      },
    ],
    { cancelable: !isForce },
  );
}
