import QuizBox from '@/src/features/quizAndVote/components/QuizBox';
import VoteBox from '@/src/features/quizAndVote/components/VoteBox';
import { COMMUNITY_ROUTER } from '@/src/shared/constants/route';
import { router } from 'expo-router';
import React, { memo } from 'react';
import { Dimensions } from 'react-native';
import { BorderLine, Container, ContentBox, Wrap } from '../../shared/styles/styles';
import { useHandleLikeBookmark } from '../hooks/useHandleLikeBookmark';
import useVisitor from '../hooks/useVisitor';
import { useMoreSheetStore } from '../store/useMoreSheetStore';
import { PostsListItemType } from '../types';
import PostSingleImage from './elements/body/PostSingleImage';
import PostTextContent from './elements/body/PostTextContent';
import PostCommonFooter from './elements/footer/PostCommonFooter';
import PostCommonHeader from './elements/header/PostCommonHeader';

const PostListCard = ({ data }: { data: PostsListItemType }) => {
  const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);

  const { handleToggleLike, handleToggleBookmark } = useHandleLikeBookmark();
  const { handleBlockVisitor } = useVisitor();
  const { showPostMoreSheet } = useMoreSheetStore();

  return (
    <Container>
      <Wrap
        width={SCREEN_WIDTH}
        onPress={() => {
          handleBlockVisitor(() => router.push(COMMUNITY_ROUTER.DETAIL(data.postId)));
        }}
      >
        <PostCommonHeader
          postId={data.postId}
          isAnonymous={data.isAnonymous}
          userImageUrl={data.userImageUrl}
          authorName={data.authorName}
          createdAt={data.createdAt}
          boardCategory={data.boardCategory}
          viewCount={data.viewCount}
          isBookmarked={data.isBookmarked}
          onToggleBookmark={() => handleBlockVisitor(() => handleToggleBookmark(data.postId, data.isBookmarked))}
        />

        <ContentBox>
          {/* 퀴즈, 투표가 아닌 게시글에만 이미지 존재 */}
          {data.boardCategory !== 'QUIZ' &&
            data.boardCategory !== 'VOTE' &&
            'postInfo' in data &&
            data.postInfo.contentImageUrl && (
              <PostSingleImage
                imageUrl={data.postInfo.contentImageUrl}
                imageCount={data.postInfo.imageCount}
                pageWidth={SCREEN_WIDTH - 20 * 2}
              />
            )}

          {/* 퀴즈 게시글 */}
          {data.boardCategory === 'QUIZ' && 'pollInfo' in data && data.pollInfo && <QuizBox data={data.pollInfo} />}

          {/* 투표 게시글 */}
          {data.boardCategory === 'VOTE' && 'pollInfo' in data && data.pollInfo && <VoteBox data={data.pollInfo} />}

          <PostTextContent isTruncate={true} postId={data.postId} content={data.contentPreview} />
        </ContentBox>

        <PostCommonFooter
          isLiked={data.isLiked}
          likeCount={data.likeCount}
          onToggleLike={() => handleBlockVisitor(() => handleToggleLike(data.postId, data.isLiked))}
          onToggleComment={() => handleBlockVisitor(() => router.push(COMMUNITY_ROUTER.DETAIL(data.postId)))}
          commentCount={data.commentCount}
          onOpenModal={() => handleBlockVisitor(() => showPostMoreSheet(data.postId, data.authorId))}
        />
      </Wrap>
      <BorderLine width={SCREEN_WIDTH} />
    </Container>
  );
};

export default memo(PostListCard);
