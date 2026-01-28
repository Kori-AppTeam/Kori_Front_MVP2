import { COMMUNITY_ROUTER } from '@/src/shared/constants/route';
import { router } from 'expo-router';
import React from 'react';
import { SCREEN_WIDTH } from '../../shared/constants/constants';
import { BorderLine, Container, ContentBox, Wrap } from '../../shared/styles/styles';
import { useHandleLikeBookmark } from '../hooks/useHandleLikeBookmark';
import { useMoreSheetStore } from '../store/useMoreSheetStore';
import { MyHistoryPost } from '../types';
import PostTextContent from './elements/body/PostTextContent';
import PostCommonFooter from './elements/footer/PostCommonFooter';
import PostCommonHeader from './elements/header/PostCommonHeader';

type MyHistoryCardProps = {
  data: MyHistoryPost;
  authorId?: number;
};

const MyHistoryCard = ({ authorId, data }: MyHistoryCardProps) => {
  const { showPostMoreSheet } = useMoreSheetStore();
  const { handleToggleLike } = useHandleLikeBookmark();

  return (
    <Container>
      <Wrap width={SCREEN_WIDTH} onPress={() => router.push(COMMUNITY_ROUTER.DETAIL(data.id))}>
        <PostCommonHeader postId={data.id} createdAt={data.createdAt} viewCount={data.viewCount} />

        <ContentBox>
          <PostTextContent isTruncate={true} postId={data.id} content={data.content} />
        </ContentBox>

        <PostCommonFooter
          commentCount={data.commentCount}
          isLiked={data.isLiked}
          likeCount={data.likeCount}
          onToggleLike={() => handleToggleLike(data.id, data.isLiked)}
          onToggleComment={() => router.push(COMMUNITY_ROUTER.DETAIL(data.id))}
          onOpenModal={() => authorId && showPostMoreSheet(data.id, authorId)}
        />
      </Wrap>
      <BorderLine width={SCREEN_WIDTH} />
    </Container>
  );
};

export default MyHistoryCard;
