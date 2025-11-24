import React, { memo } from 'react';
import { ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-reanimated/lib/typescript/Animated';
import styled from 'styled-components/native';

type Props = {
  images: string[];
  gap: number;
  offset: number;
  pageWidth: number;
};

function Carousel({ images, gap, offset, pageWidth }: Props) {
  // 이미지 슬라이드
  const renderItem: ListRenderItem<string> = ({ item }) => {
    return <ImageString source={{ uri: item }} resizeMode="cover" />;
  };

  return (
    <Container>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: offset + gap / 2,
        }}
      />
    </Container>
  );
}

const Container = styled.View`
  width: 335;
  height: 200;
  flex: 1;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const ImageString = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;
const ImageCount = styled.Text`
  width: 28;
  height: 20;
  background-color: #171818;
  opacity: 70%;
  color: #cccfd0;
  position: absolute;
  bottom: 6;
  right: 6;
  border-radius: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export default memo(Carousel);
