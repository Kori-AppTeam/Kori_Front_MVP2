import * as SecureStore from 'expo-secure-store';

export async function saveAuthToken(accessToken: string, refreshToken: string, userId: number) {
  await SecureStore.setItemAsync('jwt', accessToken, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  await SecureStore.setItemAsync('refresh', refreshToken, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  await SecureStore.setItemAsync('MyuserId', userId.toString(), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}
