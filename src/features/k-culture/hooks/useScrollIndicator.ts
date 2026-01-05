import {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

export const useScrollIndicator = (containerWidth: number, indicatorWidth: number) => {
  // 스크롤 위치 저장
  const scrollX = useSharedValue(0); // 사용자 스크롤
  const contentWidth = useSharedValue(1); // 전체 컨텐츠 너비
  const layoutWidth = useSharedValue(1); // 화면에 보이는 너비

  // 스크롤 이벤트 핸들러
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const indicatorStyle = useAnimatedStyle(() => {
    // 최대 스크롤 가능한 거리
    const maxScrollX = contentWidth.value - layoutWidth.value;

    // 스크롤이 불가능한 경우
    if (maxScrollX <= 0) {
      return {
        transform: [{ translateX: 0 }],
      };
    }

    // 보간 계산: 스크롤 위치에 따라 인디케이터 위치 결정
    const translateX = interpolate(
      scrollX.value, // 입력 값: 현재 스크롤 위치
      [0, maxScrollX], // 입력 범위: 0부터 최대 스크롤 위치까지
      [0, containerWidth - indicatorWidth], // 출력 범위: 0부터 인디케이터가 이동할 수 있는 최대 위치까지
      Extrapolation.CLAMP, // 범위를 벗어날 경우 고정
    );

    return {
      transform: [{ translateX }],
    };
  });

  return { onScroll, indicatorStyle, scrollX, contentWidth, layoutWidth };
};
