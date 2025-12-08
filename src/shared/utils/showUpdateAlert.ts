import { APP_VERSION_CHECK_ERROR } from '@/src/shared/constants/error';
import { getAxiosErrorCode } from '@/src/shared/utils/getAxiosErrorCode';
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

export function showUpdateErrorAlert(error: unknown) {
  const errorConfig = getAxiosErrorCode(error);

  const title = 'Version Error';
  const message = APP_VERSION_CHECK_ERROR[errorConfig].message || APP_VERSION_CHECK_ERROR['UNKNOWN_STATUS'].message;
  Alert.alert(title, message, [
    {
      text: 'OK',
      onPress: () => {},
    },
  ]);
}
