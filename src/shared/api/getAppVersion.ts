import api from '@/api/axiosInstance';

export async function getAppVersion(platform: string, currentVersion: string) {
  try {
    const response = await api.get(`/api/v1/app/version`, {
      params: { platform, currentVersion },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
