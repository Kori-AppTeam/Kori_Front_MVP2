// hooks/useTabFocusTracker.ts
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { usePathname } from 'expo-router';
import analytics from '@react-native-firebase/analytics';

/**
 * Expo pathname의 상태 변화를 감지하여 탭 변경 시마다 Firebase Analytics에 screen_view 이벤트를 전송
 *
 * 탭 이동 시마다 screen_view 이벤트를 전송합니다. 단, 페이지 간의 이동은 기록되지 않습니다.
 * 페이지 간의 이동은 useScreenChangeTracker를 통해 기록합니다.
 */

export const useTabFocusTracker = () => {
  const currentScreenName = usePathname();

  // 탭이 포커스될 때마다 실행
  useFocusEffect(
    useCallback(() => {
      // Firebase Analytics에 screen_view 이벤트 전송
      if (currentScreenName) {
        analytics().logScreenView({
          screen_name: currentScreenName,
          screen_class: 'TabScreen',
        });
      }
    }, [currentScreenName]),
  );
};
