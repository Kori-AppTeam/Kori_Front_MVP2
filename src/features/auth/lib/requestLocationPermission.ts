import * as Location from 'expo-location';

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`TIMEOUT:${label}:${ms}ms`));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

export async function requestLocationPermission() {
  try {
    console.log('[Location] requestForegroundPermissionsAsync start');
    const permission = await withTimeout(Location.requestForegroundPermissionsAsync(), 10000, 'requestForeground');
    console.log('[Location] requestForegroundPermissionsAsync result', permission);

    const { status } = permission;

    if (status !== 'granted') {
      console.log('[Location] permission not granted');
      return { latitude: null, longitude: null };
    }

    console.log('[Location] hasServicesEnabledAsync start');
    const servicesEnabled = await withTimeout(Location.hasServicesEnabledAsync(), 3000, 'hasServicesEnabled');
    console.log('[Location] hasServicesEnabledAsync result', { servicesEnabled });
    if (!servicesEnabled) {
      return { latitude: null, longitude: null };
    }

    // 에뮬레이터/신규설치 환경에선 lastKnown이 비어있는 경우가 많아 빠르게 시도 후 폴백합니다.
    console.log('[Location] getLastKnownPositionAsync start');
    const lastKnown = await withTimeout(Location.getLastKnownPositionAsync(), 2000, 'getLastKnownPosition');
    console.log('[Location] getLastKnownPositionAsync result', { hasLocation: !!lastKnown });

    const location =
      lastKnown ??
      (await withTimeout(
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          mayShowUserSettingsDialog: true,
        }),
        8000,
        'getCurrentPosition',
      ));
    console.log('[Location] resolved location', { hasLocation: !!location });

    return {
      latitude: location ? String(location.coords.latitude) : null,
      longitude: location ? String(location.coords.longitude) : null,
    };
  } catch (error) {
    console.log('[Location] error', error);
    // 오류 발생 시에도 별도 에러 핸들링 없이 null 반환
    return { latitude: null, longitude: null };
  }
}
