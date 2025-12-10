import { useCallback, useEffect, useState } from 'react';
import {
  showFeedbackAlert,
  showFeedbackDoneAlert,
  showFeedbackFailedAlert,
} from '@/src/shared/utils/showFeedbackAlert';
import { useStartCountStore } from '@/src/store/useStartCountStore';
import { postFeedback } from '@/src/shared/api/postFeedback';

/**
 * 앱 시작 횟수가 5회일 때 사용자에게 피드백을 요청하고, 응답을 서버로 전송합니다.
 *
 * - 피드백 요청은 한 번만 수행됩니다.
 * - 사용자가 만족도를 선택하면 해당 정보와 추가 의견을 서버에 전송합니다.
 * - 추가 의견의 경우, Alert로 text input을 받지 못해 현재는 'no contents'로 전송됩니다.
 * - 추후 앱이 안정되면 피드백 요청 로직이 크게 변경될 수 있습니다.
 * - (앱스토어 이동, text input Modal UI 추가 등)
 */

export function useRequestFeedback() {
  const [hasRequested, setHasRequested] = useState(false);

  const { startCount } = useStartCountStore();

  // 피드백 응답 처리 함수
  const onPressHandler = useCallback(async (satisfied: string) => {
    try {
      await postFeedback(satisfied, 'no contents'); // 추가 의견은 현재 'no contents'로 전송
      showFeedbackDoneAlert();
      return;
    } catch (error) {
      console.error('[Feedback] Failed to send feedback:', error);
      showFeedbackFailedAlert();
      return;
    }
  }, []);

  // 피드백 요청 함수
  const requestFeedback = useCallback(async () => {
    // 앱 시작 횟수가 5회이거나 요청된 적이 없는 경우에만 피드백 요청
    console.log('[Feedback] App Start Count:', startCount);

    if (startCount !== 5 || hasRequested) {
      return;
    }

    await showFeedbackAlert(onPressHandler); // 피드백 요청 Alert 표시 및 api 호출
    setHasRequested(true);
  }, [startCount, hasRequested]);

  // 화면이 처음 렌더링될 때 피드백 요청
  useEffect(() => {
    requestFeedback();
  }, [requestFeedback]);
}
