import { useState } from 'react';
import { updateTranslateStateAPI } from '../api/translation';

export const useTranslation = (roomId: string, updateMessageList: () => void) => {
  const [isTranslate, setIsTranslate] = useState(false);

  /** 번역 상태 변경 및 메시지 리스트 업데이트 */
  const toggleTranslate = async () => {
    try {
      await updateTranslateStateAPI(roomId, !isTranslate);
      setIsTranslate(!isTranslate);
      updateMessageList();
    } catch (err) {
      console.error('번역 상태 업데이트 실패', err);
    }
  };

  return { isTranslate, toggleTranslate };
};