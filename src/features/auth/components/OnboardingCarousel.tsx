import React, { useRef, useState } from 'react';
import { Animated, ImageBackground, ImageURISource, Platform, useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';

import Icon, { IconType } from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';

type OnboardingData = {
  id: string;
  image: any;
  TitleText: string;
  SubTitleText: string;
};

interface OnboardingCarouselProps {
  onboardingImages: ImageURISource[];
}

const OnboardingCarousel = ({ onboardingImages }: OnboardingCarouselProps) => {
  const { width, height } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentPage, setCurrentPage] = useState(0);

  const PAGE_ICONS = ['page1', 'page2', 'page3'] as const;
  const ONBOARDING_CAROUSEL_DATA: OnboardingData[] = [
    {
      id: '1',
      image: onboardingImages[0],
      TitleText: 'Meet New friends',
      SubTitleText: 'Connect with people abroad in Korea for\nstudy, work, travel, or more.',
    },
    {
      id: '2',
      image: onboardingImages[1],
      TitleText: 'Chat Without Barriers',
      SubTitleText: 'Chat in your own language.\nJust hit the translate button to read theirs.',
    },
    {
      id: '3',
      image: onboardingImages[2],
      TitleText: 'Connect in our community',
      SubTitleText: 'Have questions or stories to tell?\nJoin in and talk freely with everyone.',
    },
  ] as const;

  return (
    <>
      {/* 온보딩 이미지 영역 */}
      <OnBoardingContainer>
        <Animated.FlatList<OnboardingData>
          data={ONBOARDING_CAROUSEL_DATA}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
          onMomentumScrollEnd={(e) => {
            const page = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentPage(page);
          }}
          initialNumToRender={3}
          windowSize={3}
          removeClippedSubviews={false}
          renderItem={({ item }) => (
            <Slide
              source={item.image}
              defaultSource={onboardingImages[0]} // 첫 페인트 보완 ?
              resizeMode="cover"
              style={{ width, height: height * 0.55 }}
            >
              <Overlay>
                <OnBoardingText>{item.TitleText}</OnBoardingText>
                <OnBoardingSubText>{item.SubTitleText}</OnBoardingSubText>
              </Overlay>
            </Slide>
          )}
        />

        {/* 페이지 인디케이터 */}
        <PageIndicatorWrapper>
          <Icon type={(PAGE_ICONS[currentPage] ?? 'page1') as IconType} size={32} color={theme.colors.primary.mint} />
        </PageIndicatorWrapper>
      </OnBoardingContainer>
    </>
  );
};

export default OnboardingCarousel;

const OnBoardingContainer = styled.View`
  flex: 2;
`;

const Slide = styled(ImageBackground)`
  flex: 1;
  align-items: center;
`;

const Overlay = styled.View`
  position: absolute;
  bottom: -25px;
  padding: 16px 24px;
  border-radius: 12px;
  align-items: center;
  width: 100%;
`;

const OnBoardingText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  font-size: 24px;
  font-family: PlusJakartaSans_600SemiBold;
`;

const OnBoardingSubText = styled.Text`
  color: ${({ theme }) => theme.colors.gray.gray_2};
  font-size: 13px;
  text-align: center;
  font-family: PlusJakartaSans_400Regular;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const PageIndicatorWrapper = styled.View`
  position: absolute;
  bottom: ${Platform.OS === 'ios' ? '-30px' : '0px'};
  left: 0;
  right: 0;
  align-items: center;
`;
