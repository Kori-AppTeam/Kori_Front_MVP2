import PostCarousel from '@/src/features/community/post/components/elements/body/PostCarousel';
import PostSingleImage from '@/src/features/community/post/components/elements/body/PostSingleImage';
import PostTextContent from '@/src/features/community/post/components/elements/body/PostTextContent';
import PostCommonFooter from '@/src/features/community/post/components/elements/footer/PostCommonFooter';
import PostCommonHeader from '@/src/features/community/post/components/elements/header/PostCommonHeader';
import { PostDetail } from '@/src/features/community/post/types';
import { ContentBox } from '@/src/features/community/shared/styles/styles';
import React from 'react';
import styled from 'styled-components/native';
import { SCREEN_WIDTH } from '../../shared/constants/constants';
import { useHandleLikeBookmark } from '../hooks/useHandleLikeBookmark';
import { useMoreSheetStore } from '../store/useMoreSheetStore';

interface PostDetailCardProps {
  data: PostDetail;
  onShowProfileModal: () => void;
}

const PostDetailCard = ({ data, onShowProfileModal }: PostDetailCardProps) => {
  const { handleToggleBookmark, handleToggleLike } = useHandleLikeBookmark();
  const { showPostMoreSheet } = useMoreSheetStore();

  return (
    <Container>
      <PostCommonHeader
        showProfileModal={true}
        onShowProfileModal={onShowProfileModal}
        authorId={data.authorId}
        postId={data.postId}
        authorName={data.authorName}
        isAnonymous={data.isAnonymous}
        userImageUrl={data.userImageUrl}
        createdAt={data.createdTime}
        boardCategory={data.boardCategory}
        viewCount={data.viewCount}
        isBookmarked={data.isBookmarked}
        onToggleBookmark={() => handleToggleBookmark(data.postId, data.isBookmarked)}
      />

      <ContentBox>
        {/* 이미지 컨텐츠 */}
        {data.contentImageUrls !== undefined &&
          data.contentImageUrls.length > 0 &&
          (data.contentImageUrls.length > 1 ? (
            <PostCarousel
              images={data.contentImageUrls}
              gap={5}
              offset={20}
              pageWidth={SCREEN_WIDTH}
              imageCount={data.imageCount}
            />
          ) : (
            <PostSingleImage
              imageUrl={data.contentImageUrls[0]}
              imageCount={data.imageCount}
              pageWidth={SCREEN_WIDTH - 20 * 2}
            />
          ))}

        {/* 텍스트 컨텐츠 */}
        <PostTextContent isTruncate={false} content={data.content} />
      </ContentBox>

      <PostCommonFooter
        isLiked={data.isLiked}
        likeCount={data.likeCount}
        commentCount={data.commentCount}
        onToggleLike={() => handleToggleLike(data.postId, data.isLiked)}
        onOpenModal={() => showPostMoreSheet(data.postId, data.authorId)}
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
