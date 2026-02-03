import { SCREEN_WIDTH } from '@/src/features/community/shared/constants/constants';
import React from 'react';
import { hasValidImages } from '../../../utils/postUtils';
import PostCarousel from './PostCarousel';
import PostSingleImage from './PostSingleImage';

interface PostImagesProps {
  images?: string[] | string | null;
  imageCount?: number;
}

const PostImages = ({ images, imageCount }: PostImagesProps) => {
  // 이미지 유효성 검사: 없거나 빈 값일 경우 null 반환
  if (!hasValidImages(images)) {
    return null;
  }

  const imageList = Array.isArray(images) ? images : [images];

  return (
    <>
      {imageList.length > 1 ? (
        <PostCarousel
          images={imageList as string[]}
          gap={5}
          offset={20}
          pageWidth={SCREEN_WIDTH}
          imageCount={imageCount ?? imageList.length}
        />
      ) : (
        <PostSingleImage
          imageUrl={imageList[0] as string}
          imageCount={imageCount ?? imageList.length}
          pageWidth={SCREEN_WIDTH - 20 * 2}
        />
      )}
    </>
  );
};

export default PostImages;
