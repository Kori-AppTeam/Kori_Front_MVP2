import axios from 'axios';
import { AppLoginResponse } from '@/src/features/auth/types/api.types';
import { Config } from '@/src/shared/constants/config';
import { AppleAuthenticationCredential } from 'expo-apple-authentication';

export async function postAppleAppLogin(credential: AppleAuthenticationCredential, rawNonce: string) {
  const response = await axios.post<AppLoginResponse>(`${Config.SERVER_URL}/api/v1/member/apple/app-login`, {
    identityToken: credential.identityToken,
    authorizationCode: credential.authorizationCode,
    nonce: rawNonce,
    email: credential.email,
    fullName: {
      givenName: credential.fullName?.givenName,
      familyName: credential.fullName?.familyName,
    },
  });

  return response.data.data;
}
