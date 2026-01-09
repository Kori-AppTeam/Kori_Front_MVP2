import React, { useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  Animated,
  ImageBackground,
  useWindowDimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

import { textStyle, theme } from '@/src/styles/theme';
import CustomButton from '@/src/shared/components/CustomButton';
import { AUTH_ROUTE } from '@/src/shared/constants/route';
import CarouselIndicator from '@/src/features/onboarding/components/CarouselIndicator';

type OnboardingData = {
  id: string;
  image: any;
  TitleText: string;
  SubTitleText: string;
};

interface OnboardingCarouselProps {
  onboardingData: OnboardingData[];
}

const OnboardingCarousel = ({ onboardingData }: OnboardingCarouselProps) => {
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const nextButtonHandler = () => {
    if (currentPage < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentPage + 1, animated: true });
      setCurrentPage((prev) => prev + 1);
    } else {
      router.replace(AUTH_ROUTE);
    }
  };

  return (
    <OnBoardingContainer>
      <Animated.FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
          listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const page = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentPage(page);
          },
        })}
        initialNumToRender={4}
        windowSize={4}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <Slide width={width}>
            <Title>{item.TitleText}</Title>
            <Subtitle>{item.SubTitleText}</Subtitle>
            <CarouselIndicator total={onboardingData.length} current={currentPage} />
            <SlideImage source={item.image} defaultSource={onboardingData[0].image} resizeMode="contain" />
          </Slide>
        )}
      />

      <LinearGradient
        colors={['rgba(0,0,0,0)', theme.colors.primary.black]}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 200,
        }}
        pointerEvents="none"
      />
      <ButtonContainer>
        <CustomButton
          label={currentPage === onboardingData.length - 1 ? 'Start' : 'Next'}
          onPress={nextButtonHandler}
        />
      </ButtonContainer>
    </OnBoardingContainer>
  );
};

export default OnboardingCarousel;

const OnBoardingContainer = styled.View`
  width: 100%;
  height: 100%;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary.black};
`;

const Slide = styled(ImageBackground)<{ width: number }>`
  display: flex;
  position: relative;
  flex: 1;
  width: ${({ width }) => width};
  height: 90%;
  align-items: center;
  justify-content: start;
`;

const SlideImage = styled.Image`
  width: 80%;
  height: 100%;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.headline.H2_SB)};
  padding-bottom: 8px;
`;

const Subtitle = styled.Text`
  color: ${({ theme }) => theme.colors.gray.gray_2};
  ${({ theme }) => textStyle(theme.fonts.body.B2_R)};
  text-align: center;
  flex-wrap: wrap;
  padding-bottom: 8px;
`;

const ButtonContainer = styled.View`
  display: flex;
  position: absolute;

  bottom: 48;
  width: 100%;
  padding: 0 24px;
  height: 48px;
  flex: 1;
`;
