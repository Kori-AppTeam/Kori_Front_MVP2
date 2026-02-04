import api from '@/api/axiosInstance';
import * as SecureStore from 'expo-secure-store';

export async function deleteAuthToken(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync('jwt').catch(() => {}),
    SecureStore.deleteItemAsync('refresh').catch(() => {}),
    SecureStore.deleteItemAsync('MyuserId').catch(() => {}),
  ]);

  delete (api.defaults.headers as any).Authorization;
}
