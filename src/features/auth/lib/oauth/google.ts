import { Config } from '@/src/shared/constants/config';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

/* --------- 구글 사용자 인증 --------- */
export async function getGoogleAuthCode() {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
      // setUserInfo({ userInfo: response.data });
      const code = response.data.serverAuthCode;
      if (!code) {
        // setGoogleLoading(false);
        throw new Error('MISSING_AUTH_CODE');
      }
      return code;
    }
  } catch (error: unknown) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS: // 로그인 진행 중인 경우
          throw new Error('ALREADY_IN_PROGRESS');
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE: // 구글 플레이 서비스가 없는 경우
          throw new Error('PLAY_SERVICE_NOT_AVAILABLE');
        default:
          throw new Error('UNKNOWN');
      }
    } else {
      throw new Error('UNKNOWN');
    }
  }
}

/* --------- 구글 인증 초기화 --------- */
export async function initGoogleAuth() {
  GoogleSignin.configure({
    webClientId: `${Config.GOOGLE_WEB_CLIENT_ID}`,
    iosClientId: `${Config.GOOGLE_IOS_CLIENT_ID}`,
    offlineAccess: true,
  });
}
