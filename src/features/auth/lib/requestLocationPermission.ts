import * as Location from 'expo-location';

export async function requestLocationPermission() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return { latitude: null, longitude: null };
    }

    const location = await Location.getLastKnownPositionAsync();
    return {
      latitude: location ? String(location.coords.latitude) : null,
      longitude: location ? String(location.coords.longitude) : null,
    };
  } catch (error) {
    // 오류 발생 시에도 별도 에러 핸들링 없이 null 반환
    return { latitude: null, longitude: null };
  }
}
