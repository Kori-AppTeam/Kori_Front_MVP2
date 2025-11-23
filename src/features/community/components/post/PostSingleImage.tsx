import React, { memo } from 'react';
import styled from 'styled-components/native';

type PostSingleImageProps = {
  imageUrl: string;
  imageCount: number;
  pageWidth: number;
};

function PostSingleImage({ imageUrl, imageCount, pageWidth }: PostSingleImageProps) {
  const count = imageCount - 1;

  // 단일 이미지
  return (
    <Container width={pageWidth}>
      <ImageString source={{ uri: imageUrl }} resizeMode="cover" />
      {imageCount > 1 && (
        <CountContainer>
          <ImageCount style={{ textAlign: 'center', textAlignVertical: 'center' }}>+ {count}</ImageCount>
        </CountContainer>
      )}
    </Container>
  );
}

export default memo(PostSingleImage);

const Container = styled.View<{ width: number }>`
  width: ${({ width }) => (width ? width : 335)}px;
  height: 200px;
  position: relative;
`;
const ImageString = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;
const CountContainer = styled.View`
  width: 28px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 6px;
  right: 6px;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.gray.darkBlack_1};
  opacity: 0.7;
  border-radius: 100px;
`;
const ImageCount = styled.Text`
  color: #cccfd0;
  text-align: center;
  ${({ theme }) => theme.fonts.small.small_M}
  line-height: 20px;
`;
