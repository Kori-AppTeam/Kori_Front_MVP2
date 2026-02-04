import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { getProfileSetupCompleted } from '@/src/features/profile-setup/api/profile';
import { PROFILE_SETUP_ROUTE } from '@/src/shared/constants/route';

export function useCheckProfileSetupCompleted() {
  const [profileSetupModalVisible, setProfileSetupModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        try {
          const completed = await getProfileSetupCompleted();
          if (cancelled) return;
          setProfileSetupModalVisible(!completed);
        } catch (error) {
          console.error('[profile-setup] Failed to check completion:', error);
          if (cancelled) return;
          setProfileSetupModalVisible(false);
        }
      })();

      return () => {
        cancelled = true;
      };
    }, []),
  );

  const goToProfileSetup = useCallback(() => {
    setProfileSetupModalVisible(false);
    router.replace(PROFILE_SETUP_ROUTE.BASIC_INFO);
  }, []);

  return {
    goToProfileSetup,
    profileSetupModalVisible,
  };
}
