import axios from 'axios';

export async function postRefreshToken(refreshToken: string) {
  try {
    const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/v1/member/refresh`, { refreshToken });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
