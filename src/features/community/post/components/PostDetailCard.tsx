import PostTextContent from '@/src/features/community/post/components/elements/body/PostTextContent';
import PostCommonFooter from '@/src/features/community/post/components/elements/footer/PostCommonFooter';
import PostCommonHeader from '@/src/features/community/post/components/elements/header/PostCommonHeader';
import { PostDetailType } from '@/src/features/community/post/types';
import { ContentBox } from '@/src/features/community/shared/styles/styles';
import React from 'react';
import styled from 'styled-components/native';
import { useHandleLikeBookmark } from '../hooks/useHandleLikeBookmark';
import { useMoreSheetStore } from '../store/useMoreSheetStore';
import { parsePostMediaInfo } from '../utils/postUtils';
import PostImages from './elements/body/PostImages';
import PostPoll from './elements/body/PostPoll';

interface PostDetailCardProps {
  data: PostDetailType;
  onShowProfileModal: () => void;
}

const PostDetailCard = ({ data, onShowProfileModal }: PostDetailCardProps) => {
  const { handleToggleBookmark, handleToggleLike } = useHandleLikeBookmark();
  const { showPostMoreSheet } = useMoreSheetStore();

  const parsedMediaInfo = parsePostMediaInfo(data);

  return (
    <Container>
      <PostCommonHeader
        showProfileModal={true}
        onShowProfileModal={onShowProfileModal}
        authorId={data.authorId}
        postId={data.id}
        authorName={data.authorName}
        isAnonymous={data.isAnonymous}
        userImageUrl={data.userImageUrl}
        createdAt={data.createdTime}
        boardCategory={data.boardCategory}
        viewCount={data.viewCount}
        isBookmarked={data.isBookmarked}
        onToggleBookmark={() => handleToggleBookmark(data.id, data.isBookmarked)}
      />

      <ContentBox>
        {/* 이미지 컨텐츠 - 일반 게시글의 경우 텍스트 위에 */}
        {parsedMediaInfo.MediaType === 'GENERAL' && (
          <PostImages
            images={parsedMediaInfo.postInfo?.contentImageUrl}
            imageCount={parsedMediaInfo.postInfo?.imageCount}
          />
        )}

        {/* 텍스트 컨텐츠 */}
        <PostTextContent isTruncate={false} content={data.content} />

        {/* 퀴즈/투표 컨텐츠 - 텍스트 아래에 */}
        {(parsedMediaInfo.MediaType === 'QUIZ' || parsedMediaInfo.MediaType === 'VOTE') && (
          <PostPoll type={parsedMediaInfo.MediaType} pollInfo={parsedMediaInfo.pollInfo} pollId={data.id} />
        )}
      </ContentBox>

      <PostCommonFooter
        isLiked={data.isLiked}
        likeCount={data.likeCount}
        commentCount={data.commentCount}
        onToggleLike={() => handleToggleLike(data.id, data.isLiked)}
        onOpenModal={() => showPostMoreSheet(data.id, data.authorId)}
      />
    </Container>
  );
};

export default React.memo(PostDetailCard);

const Container = styled.View`
  padding: 20px 0;
  background-color: ${({ theme }) => theme.colors.primary.black};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
