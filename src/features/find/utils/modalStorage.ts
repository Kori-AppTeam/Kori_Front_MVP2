import AsyncStorage from '@react-native-async-storage/async-storage';

const MODAL_SUPPRESS_KEY = 'linkedSpaceRecommendModal_suppressUntil';

/**
 * 링크드 스페이스 추천 모달을 표시해야 하는지 확인
 * @returns true면 모달 표시, false면 숨김
 */
export const shouldShowModal = async (): Promise<boolean> => {
  try {
    const suppressUntil = await AsyncStorage.getItem(MODAL_SUPPRESS_KEY);
    if (!suppressUntil) return true;

    const suppressDate = new Date(suppressUntil);
    const today = new Date();

    // 저장된 날짜가 오늘보다 이전이면 모달 표시
    return today > suppressDate;
  } catch (error) {
    console.error('Failed to check modal suppression:', error);
    return true;
  }
};

/**
 * 오늘 하루 동안 모달을 표시하지 않도록 설정
 */
export const suppressModalForToday = async (): Promise<void> => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // 다음날 자정
    await AsyncStorage.setItem(MODAL_SUPPRESS_KEY, tomorrow.toISOString());
  } catch (error) {
    console.error('Failed to suppress modal:', error);
  }
};
