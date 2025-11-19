import { randomUUID } from 'expo-crypto';
import * as AppleAuthentication from 'expo-apple-authentication';

/* --------- 애플 사용자 인증 --------- */
export async function getAppleCredential() {
  const rawNonce = randomUUID();
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: rawNonce,
  });

  return { credential, rawNonce };
}
