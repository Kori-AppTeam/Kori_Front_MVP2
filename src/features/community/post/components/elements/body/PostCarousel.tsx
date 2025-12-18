import { ASPECT_RATIO } from '@/src/features/community/shared/constants/constants';
import React, { memo, useCallback, useState } from 'react';
import { FlatList, ListRenderItem, ViewToken } from 'react-native';
import styled from 'styled-components/native';

type PostCarouselProps = {
  images: string[];
  gap: number;
  offset: number;
  pageWidth: number;
  imageCount: number;
};

const PostCarousel = ({ images, gap, offset, pageWidth, imageCount }: PostCarouselProps) => {
  const IMAGE_WIDTH = pageWidth - offset * 2;
  const [currentIndex, setCurrentIndex] = useState(0);

  // 이미지 슬라이드
  const renderItem: ListRenderItem<string> = useCallback(({ item }) => {
    return <ImageString source={{ uri: item }} resizeMode="cover" width={IMAGE_WIDTH} />;
  }, []);

  // 이미지 위치 표시
  const onChangeCount = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }, []);

  return (
    <Container width={pageWidth} offset={offset}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: offset,
          gap: gap,
        }}
        decelerationRate="fast"
        snapToInterval={IMAGE_WIDTH + gap}
        snapToAlignment="start"
        bounces={true}
        onViewableItemsChanged={onChangeCount}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
      <CountContainer offset={offset}>
        <ImageCount>
          {currentIndex + 1} / {imageCount}
        </ImageCount>
      </CountContainer>
    </Container>
  );
};

export default memo(PostCarousel);

const Container = styled.View<{ width: number; offset: number }>`
  width: ${({ width }) => (width ? width : 335)}px;
  height: ${({ width, offset }) => (width - offset * 2) * ASPECT_RATIO}px;
  position: relative;
`;
const ImageString = styled.Image<{ width: number }>`
  width: ${({ width }) => (width ? width : 335)}px;
  height: 100%;
  border-radius: 8px;
`;
const CountContainer = styled.View<{ offset: number }>`
  width: 35px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 6px;
  right: ${({ offset }) => 6 + (offset || 0)}px;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.gray.darkBlack_1};
  opacity: 0.7;
  border-radius: 100px;
`;
const ImageCount = styled.Text`
  color: ${({ theme }) => theme.colors.gray.lightGray_1};
  text-align: center;
  ${({ theme }) => theme.fonts.small.small_M}
`;
