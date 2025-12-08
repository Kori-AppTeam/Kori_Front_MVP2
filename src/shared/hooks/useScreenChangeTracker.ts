import { useEffect, useRef } from 'react';
import { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';

/**
 * React Navigation의 상태 변화를 감지하여 Firebase Analytics에 screen_view 이벤트를 전송
 * @param navigationRef useNavigationContainerRef()로 생성된 Ref 객체
 *
 * 페이지 이동 시마다 screen_view 이벤트를 전송합니다. 단, 탭 간의 이동은 기록되지 않습니다.
 * 탭 간의 이동은 useTabFocusTracker를 통해 기록합니다.
 */

export const useScreenChangeTracker = (
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>,
) => {
  const routeNameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // 1. Ref가 준비되지 않았으면 리턴
    if (!navigationRef.current) {
      return;
    }

    const currentNav = navigationRef.current;

    // 2. 네비게이션 상태 리스너 등록
    const unsubscribe = currentNav.addListener('state', async () => {
      const previousRouteName = routeNameRef.current;
      const currentRouteName = currentNav.getCurrentRoute()?.name;

      // 3. 화면 이름이 바뀌었을 때만 로그 전송
      if (previousRouteName !== currentRouteName && currentRouteName) {
        await analytics().logScreenView({
          screen_name: currentRouteName,
          screen_class: currentRouteName,
        });
        console.log(`[Analytics] Screen View: ${currentRouteName}`);
      }

      // 4. 현재 화면 이름을 저장
      routeNameRef.current = currentRouteName;
    });

    return unsubscribe; // 컴포넌트 언마운트 시 리스너 제거
  }, [navigationRef]);
};
