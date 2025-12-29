import { COMMUNITY_ROUTER } from '@/src/shared/constants/route';
import { router } from 'expo-router';
import React, { memo } from 'react';
import { Dimensions } from 'react-native';
import { BorderLine, Container, ContentBox, Wrap } from '../../shared/styles/styles';
import { useHandleLikeBookmark } from '../hooks/useHandleLikeBookmark';
import { useMoreSheetStore } from '../store/useMoreSheetStore';
import { BookmarkedPostItem } from '../types';
import PostTextContent from './elements/body/PostTextContent';
import PostCommonFooter from './elements/footer/PostCommonFooter';
import PostCommonHeader from './elements/header/PostCommonHeader';

const BookmarkedPost = ({ data }: { data: BookmarkedPostItem }) => {
  const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);

  const { showPostMoreSheet } = useMoreSheetStore();
  const { handleToggleLike, handleToggleBookmark } = useHandleLikeBookmark();

  return (
    <Container>
      <Wrap width={SCREEN_WIDTH} onPress={() => router.push(COMMUNITY_ROUTER.DETAIL(data.postId))}>
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
          onToggleComment={() => router.push(COMMUNITY_ROUTER.DETAIL(data.postId))}
          commentCount={data.commentCount}
          onOpenModal={() => showPostMoreSheet(data.postId, data.authorId)}
        />
      </Wrap>
      <BorderLine width={SCREEN_WIDTH} />
    </Container>
  );
};

export default memo(BookmarkedPost);
