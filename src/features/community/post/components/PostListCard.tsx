import Icon from '@/components/common/Icon';
import { COMMUNITY_ROUTER } from '@/src/shared/constants/route';
import { router } from 'expo-router';
import React, { memo } from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { useHandleLikeBookmark } from '../hooks/useHandleLikeBookmark';
import useVisitor from '../hooks/useVisitor';
import { PostsListItem } from '../types';
import PostSingleImage from './elements/body/PostSingleImage';
import PostTextContent from './elements/body/PostTextContent';
import PostComment from './elements/footer/PostComment';
import PostLikeButton from './elements/footer/PostLikeButton';
import PostCommonHeader from './elements/header/PostCommonHeader';

type PostCardProps = {
  data: PostsListItem;
  onOpenModal: (postId: number, authorId: number) => void;
};

const PostListCard = ({ data, onOpenModal }: PostCardProps) => {
  const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);

  const { handleToggleLike, handleToggleBookmark } = useHandleLikeBookmark();
  const { handleBlockVisitor } = useVisitor();

  return (
    <Container width={SCREEN_WIDTH}>
      <Wrap
        width={SCREEN_WIDTH}
        onPress={() => {
          handleBlockVisitor(() => router.push({ pathname: COMMUNITY_ROUTER.DETAIL, params: { id: data.postId } }));
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
          {data.contentImageUrl && (
            <PostSingleImage
              imageUrl={data.contentImageUrl}
              imageCount={data.imageCount}
              pageWidth={SCREEN_WIDTH - 20 * 2}
            />
          )}

          <PostTextContent isTruncate={true} postId={data.postId} content={data.contentPreview} />
        </ContentBox>

        <FooterRow>
          <LeftFooter>
            <PostLikeButton
              isLiked={data.isLiked}
              likeCount={data.likeCount}
              onToggleLike={() => handleToggleLike(data.postId, data.isLiked)}
            />

            <PostComment showComment={false} postId={data.postId} commentCount={data.commentCount} />
          </LeftFooter>

          <IconBtn onPress={() => handleBlockVisitor(() => onOpenModal(data.postId, data.authorId))}>
            <Icon type="eclipsisGaro" size={20} />
          </IconBtn>
        </FooterRow>
      </Wrap>
      <BorderLine width={SCREEN_WIDTH} />
    </Container>
  );
};

export default memo(PostListCard);

const Container = styled.View<{ width: number }>`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Wrap = styled.Pressable<{ width: number }>`
  width: ${({ width }) => (width ? width - 20 * 2 : 335)};
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
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
const FooterRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const LeftFooter = styled.View`
  flex-direction: row;
  align-items: center;
  row-gap: 16px;
`;
const IconBtn = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
