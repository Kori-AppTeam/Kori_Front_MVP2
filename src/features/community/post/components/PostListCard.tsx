import { COMMUNITY_ROUTER } from '@/src/shared/constants/route';
import { router } from 'expo-router';
import React, { memo } from 'react';
import { Dimensions } from 'react-native';
import { BorderLine, Container, ContentBox, Wrap } from '../../shared/styles/styles';
import { useHandleLikeBookmark } from '../hooks/useHandleLikeBookmark';
import useVisitor from '../hooks/useVisitor';
import { useMoreSheetStore } from '../store/useMoreSheetStore';
import { BoardId, PostsListItemType, SortParam } from '../types';
import { parsePostMediaInfo } from '../utils/postUtils';
import PostImages from './elements/body/PostImages';
import PostPoll from './elements/body/PostPoll';
import PostTextContent from './elements/body/PostTextContent';
import PostCommonFooter from './elements/footer/PostCommonFooter';
import PostCommonHeader from './elements/header/PostCommonHeader';

interface PostListCardProps {
  data: PostsListItemType;
  boardId: BoardId;
  sort: SortParam;
}

const PostListCard = ({ data, boardId, sort }: PostListCardProps) => {
  const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);

  const { handleToggleLike, handleToggleBookmark } = useHandleLikeBookmark();
  const { handleBlockVisitor } = useVisitor();
  const { showPostMoreSheet } = useMoreSheetStore();

  const parsedMediaInfo = parsePostMediaInfo(data);

  return (
    <Container>
      <Wrap
        width={SCREEN_WIDTH}
        onPress={() => {
          handleBlockVisitor(() => router.push(COMMUNITY_ROUTER.DETAIL(data.id)));
        }}
      >
        <PostCommonHeader
          postId={data.id}
          isAnonymous={data.isAnonymous}
          userImageUrl={data.userImageUrl}
          authorName={data.authorName}
          createdAt={data.createdAt}
          boardCategory={data.boardCategory}
          viewCount={data.viewCount}
          isBookmarked={data.isBookmarked}
          onToggleBookmark={() => handleBlockVisitor(() => handleToggleBookmark(data.id, data.isBookmarked))}
        />

        <ContentBox>
          {/* 이미지 컨텐츠 - 일반 게시글의 경우 텍스트 위에 */}
          {parsedMediaInfo.MediaType === 'GENERAL' && (
            <PostImages
              images={parsedMediaInfo.postInfo?.contentImageUrl}
              imageCount={parsedMediaInfo.postInfo?.imageCount}
            />
          )}

          <PostTextContent isTruncate={true} postId={data.id} content={data.contentPreview} />

          {/* 퀴즈/투표 컨텐츠 - 텍스트 아래에 */}
          {(parsedMediaInfo.MediaType === 'QUIZ' || parsedMediaInfo.MediaType === 'VOTE') && (
            <PostPoll
              type={parsedMediaInfo.MediaType}
              pollInfo={parsedMediaInfo.pollInfo}
              pollId={data.id}
              queryKey={['post', 'list', boardId, sort]}
            />
          )}
        </ContentBox>

        <PostCommonFooter
          isLiked={data.isLiked}
          likeCount={data.likeCount}
          onToggleLike={() => handleBlockVisitor(() => handleToggleLike(data.id, data.isLiked))}
          onToggleComment={() => handleBlockVisitor(() => router.push(COMMUNITY_ROUTER.DETAIL(data.id)))}
          commentCount={data.commentCount}
          onOpenModal={() => handleBlockVisitor(() => showPostMoreSheet(data.id, data.authorId))}
        />
      </Wrap>
      <BorderLine width={SCREEN_WIDTH} />
    </Container>
  );
};

export default memo(PostListCard);
