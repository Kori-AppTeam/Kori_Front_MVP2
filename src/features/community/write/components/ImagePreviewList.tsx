import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import React from 'react';
import { Image as RNImage, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { ImageAsset } from '../types';

interface ImagePreviewListProps {
  images: ImageAsset[];
  onRemove: (uri: string) => void;
}

export function ImagePreviewList({ images, onRemove }: ImagePreviewListProps) {
  if (images.length === 0) return null;

  return (
    <PreviewWrap pointerEvents="box-none">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
        {images.map((image) => (
          <Thumb key={image.uri}>
            <ThumbImage source={{ uri: image.uri }} />
            <RemoveBtn onPress={() => onRemove(image.uri)}>
              <Icon type="close" size={16} color={theme.colors.primary.white} />
            </RemoveBtn>
          </Thumb>
        ))}
      </ScrollView>
    </PreviewWrap>
  );
}

const PreviewWrap = styled.View`
  padding: 20px;
`;
const Thumb = styled.View`
  width: 96px;
  height: 96px;
  border-radius: 10px;
  overflow: hidden;
  background: #111213;
`;
const ThumbImage = styled(RNImage)`
  width: 96px;
  height: 96px;
`;
const RemoveBtn = styled.Pressable`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
`;
