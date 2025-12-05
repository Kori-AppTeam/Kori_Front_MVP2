import { Alert, Linking } from 'react-native';

export const confirmOpenURL = async (url: string): Promise<boolean> => {
  const supported = await Linking.canOpenURL(url);
  // 지원하지 않는 URL인 경우
  if (!supported) {
    Alert.alert('Invalid URL', `Cannot open the URL: ${url}`);
    return false;
  }

  // URL 열기 확인 Alert 표시
  return new Promise((resolve) => {
    Alert.alert(
      'Open External Link',
      'Do you want to open this link in your browser?',
      [
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: () => resolve(false),
        },
        {
          text: 'Open',
          style: 'default',
          onPress: async () => {
            if (supported) {
              await Linking.openURL(url);
              resolve(true);
            } else {
              Alert.alert('Error', `Cannot open the URL: ${url}`);
              resolve(false);
            }
          },
        },
      ],
      // 안드로이드에서는 배경 터치로 닫히도록 설정
      { cancelable: true },
    );
  });
};
