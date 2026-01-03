import { useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  showFeedbackAlert,
  showFeedbackDoneAlert,
  showFeedbackFailedAlert,
  showGoogleFormAlert,
} from '@/src/features/feedback/utils/showFeedbackAlert';
import { postFeedback } from '@/src/features/feedback/api/postFeedback';

/**
 * 앱 시작 횟수가 5회일 때 사용자에게 피드백을 요청하고, 응답을 서버로 전송합니다.
 *
 * - 피드백 요청은 한 번만 수행됩니다.
 * - 사용자가 만족도를 선택하면 해당 정보를 서버로 전송합니다.
 * - 추가 의견의 경우, 구글폼으로 이동해 작성할 수 있도록 유도합니다.
 * - 추후 앱이 안정되면 피드백 요청 로직이 크게 변경될 수 있습니다.
 * - (앱스토어 이동, text input Modal UI 추가 등)
 */

export function useRequestFeedback() {
  // 피드백 응답 처리 함수
  const onPressHandler = useCallback(async (satisfied: string) => {
    try {
      await postFeedback(satisfied, 'no contents'); // 추가 의견은 현재 'no contents'로 전송
      showGoogleFormAlert();
      // showFeedbackDoneAlert();
      await AsyncStorage.setItem('HAS_REQUESTED_FEEDBACK', 'true'); // 영구 저장
      return;
    } catch (error) {
      console.error('[Feedback] Failed to send feedback:', error);
      showFeedbackFailedAlert();
    }
  }, []);

  // 피드백 요청 함수
  const requestFeedback = useCallback(async () => {
    // 앱 시작 횟수를 storage에서 가져온 후 +1
    const startCount = await AsyncStorage.getItem('START_COUNT').then((value) => {
      return value ? Number(value) : 0;
    });

    await AsyncStorage.setItem('START_COUNT', String(startCount + 1));

    // 이전에 피드백을 요청한 적이 있는지 확인
    const hasRequested = await AsyncStorage.getItem('HAS_REQUESTED_FEEDBACK').then((value) => {
      return value === 'true';
    });

    /* NOTE 테스트용 코드, 테스트 시 주석을 풀고 실행해주세요z */
    // await showFeedbackAlert(onPressHandler);
    // return;
    /* ------------------------------------------ */

    // 앱 시작 횟수가 2회 이상일 때, 아직 피드백 요청을 한 적이 없으면 요청 실행
    if (startCount < 2 || hasRequested) {
      return;
    }

    await showFeedbackAlert(onPressHandler); // 피드백 요청 Alert 표시 및 api 호출
  }, [onPressHandler]);

  // 화면이 처음 렌더링될 때 피드백 요청
  useEffect(() => {
    requestFeedback();
  }, []);
}
