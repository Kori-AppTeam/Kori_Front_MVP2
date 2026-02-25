import { router } from 'expo-router';

import { postLogout } from '@/src/features/auth/api/postLogout';
import { deleteAuthToken } from '@/src/features/auth/lib/deleteAuthToken';
import { showProfileSetupLogoutAlert } from '@/src/features/profile-setup/util/showProfileSetupLogoutAlert';
import { AUTH_ROUTE } from '@/src/shared/constants/route';

// 프로필 셋업이 완료되지 않은 경우 Alert 안내와 함께 강제 로그아웃
export function forceLogoutWithProfileSetupAlert() {
  showProfileSetupLogoutAlert({
    onConfirm: () => {
      void (async () => {
        try {
          await postLogout();
        } catch (e) {
          console.error('[auth] logout api failed:', e);
        } finally {
          await deleteAuthToken();
          router.replace(AUTH_ROUTE);
        }
      })();
    },
  });
}
