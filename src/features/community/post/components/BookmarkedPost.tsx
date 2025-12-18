import { COMMUNITY_ROUTER } from '@/src/shared/constants/route';
import { router } from 'expo-router';
import React, { memo } from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { Container, Wrap } from '../../shared/styles/styles';
import { useHandleLikeBookmark } from '../hooks/useHandleLikeBookmark';
import { useMoreSheetStore } from '../store/useMoreSheetStore';
import { BookmarkedPostItem } from '../types';
import PostTextContent from './elements/body/PostTextContent';
import PostCommonFooter from './elements/footer/PostCommonFooter';
import PostCommonHeader from './elements/header/PostCommonHeader';

const BookmarkedPost = ({ data }: { data: BookmarkedPostItem }) => {
  const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);

  const { showMoreSheet } = useMoreSheetStore();
  const { handleToggleLike, handleToggleBookmark } = useHandleLikeBookmark();

  return (
    <Container>
      <Wrap
        width={SCREEN_WIDTH}
        onPress={() => router.push({ pathname: COMMUNITY_ROUTER.DETAIL, params: { id: data.postId } })}
      >
        <PostCommonHeader
          postId={data.postId}
          isAnonymous={data.isAnonymous}
          userImageUrl={data.userImage}
          authorName={data.authorName}
          createdAt={data.createdAt}
          viewCount={data.checkCount}
          isBookmarked={data.isBookmarked}
          onToggleBookmark={() => handleToggleBookmark(data.postId, data.isBookmarked)}
        />

        <ContentBox>
          <PostTextContent isTruncate={true} postId={data.postId} content={data.content} />
        </ContentBox>

        <PostCommonFooter
          isLiked={data.isLiked}
          likeCount={data.likeCount}
          onToggleLike={() => handleToggleLike(data.postId, data.isLiked)}
          onToggleComment={() => router.push({ pathname: COMMUNITY_ROUTER.DETAIL, params: { id: data.postId } })}
          commentCount={data.commentCount}
          onOpenModal={() => showMoreSheet(data.postId, data.authorId)}
        />
      </Wrap>
      <BorderLine width={SCREEN_WIDTH} />
    </Container>
  );
};

export default memo(BookmarkedPost);

const BorderLine = styled.View<{ width: number }>`
  width: ${({ width }) => (width ? width - 20 * 2 : 335)}px;
  border-bottom-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  border-bottom-width: 1px;
`;
const ContentBox = styled.View`
  width: 100%;
  padding: 20px 0;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
`;
