import { Config } from '@/src/shared/constants/config';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';

/* --------- 구글 사용자 인증 --------- */
export async function getGoogleAuthCode() {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
      const code = response.data.serverAuthCode;
      return code;
    }
  } catch (error) {
    throw error;
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
