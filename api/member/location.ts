import api from '../axiosInstance';

export async function patchLocation(latitude: string | null, longuitude: string | null) {
  try {
    const response = await api.patch('/api/v1/member/location', {
      latitude: latitude,
      longitude: longuitude,
    });
  } catch (error) {
    // 위치 정보 저장에 실패해도 서비스 이용이 가능하도록 에러를 throw하지 않음
    return null;
  }
}
