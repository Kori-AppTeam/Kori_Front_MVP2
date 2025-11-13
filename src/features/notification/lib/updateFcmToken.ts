import messaging from '@react-native-firebase/messaging';
import { postFcmDeviceToken } from '@/src/features/notification/api/notifications';

// fcm 토큰을 새롭게 발급 후 서버에 전송
export const updateFcmToken = async () => {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  await postFcmDeviceToken(token);
};
