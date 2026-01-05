import React from 'react';
import styled from 'styled-components/native';

const images = [
  require('@/assets/images/ai_character_1.png'),
  require('@/assets/images/ai_character_2.png'),
  require('@/assets/images/ai_character_3.png'),
];

// 현재는 고정 이미지 => 추후 무한 루프 캐러셀 구현 예정
const CharacterLoopCarousel = () => {
  return (
    <Container>
      <ImageContainer isFocused={false}>
        <StyledImage source={images[1]} resizeMode="cover" />
      </ImageContainer>

      <ImageContainer isFocused={true}>
        <StyledImage source={images[0]} resizeMode="cover" />
      </ImageContainer>

      <ImageContainer isFocused={false}>
        <StyledImage source={images[2]} resizeMode="cover" />
      </ImageContainer>
    </Container>
  );
};

export default CharacterLoopCarousel;

const Container = styled.View`
  width: 100%;
  aspect-ratio: ${375 / 265};
  overflow: hidden;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: center;
  z-index: 0;
`;

const ImageContainer = styled.View<{ isFocused: boolean }>`
  width: ${({ isFocused }) => (isFocused ? 178 : 127)}px;
  height: ${({ isFocused }) => (isFocused ? 265 : 189)}px;
`;

const StyledImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 181.45px;
  flex-shrink: 0;
`;
