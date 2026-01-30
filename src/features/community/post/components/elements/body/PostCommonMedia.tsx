import { SCREEN_WIDTH } from '@/src/features/community/shared/constants/constants';
import QuizBox from '@/src/features/quizAndVote/components/QuizBox';
import VoteBox from '@/src/features/quizAndVote/components/VoteBox';
import { PollBaseType } from '@/src/features/quizAndVote/types';
import { QueryKey } from '@tanstack/react-query';
import React from 'react';
import styled from 'styled-components/native';
import { hasValidImages } from '../../../utils/postUtils';
import PostCarousel from './PostCarousel';
import PostSingleImage from './PostSingleImage';

interface PostCommonMediaProps {
  type: 'GENERAL' | 'QUIZ' | 'VOTE';
  images?: string[] | string | null;
  imageCount?: number;
  pollInfo?: PollBaseType;
  pollId?: number;
  queryKey?: QueryKey;
}

const PostCommonMedia = ({ type, images, imageCount, pollInfo, pollId, queryKey }: PostCommonMediaProps) => {
  if (pollId && pollInfo) {
    console.log('[PostCommonMedia] Rendering poll component:', type);
    return (
      <PollContainer>
        {type === 'QUIZ' && <QuizBox pollId={pollId} data={pollInfo} queryKey={queryKey} />}
        {type === 'VOTE' && <VoteBox pollId={pollId} data={pollInfo} queryKey={queryKey} />}
      </PollContainer>
    );
  }

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

export default PostCommonMedia;

const PollContainer = styled.View`
  width: 100%;
  padding: 0 20px;
`;
