import Icon from '@/components/common/Icon';
import { CATEGORY_TO_BOARD_ID, CLIENT_CATEGORY_NAME } from '@/lib/community/constants';
import { textStyle } from '@/src/styles/theme';
import { router } from 'expo-router';
import React, { memo } from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { useToggleBookmark } from '../hooks/useToggleBookmark';
import { useToggleLike } from '../hooks/useToggleLike';
import { AllowedCategory, PostsListItem, SortParam } from '../types/postsListType';
import { timeToAgo } from '../utils/indexUtils';
import PostBookmarkButton from './post/PostBookmarkButton';
import PostComment from './post/PostComment';
import PostLikeButton from './post/PostLikeButton';
import PostSingleImage from './post/PostSingleImage';
import PostTextContent from './post/PostTextContent';
import PostUserProfileImg from './post/PostUserProfileImg';

type PostCardProps = {
  data: PostsListItem;
  sort: SortParam;
  category: AllowedCategory;
  onOpenModal: (postId: number, authorId: number) => void;
};

const PostListCard = ({ data, sort, category, onOpenModal }: PostCardProps) => {
  const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);

  const likeMutation = useToggleLike(CATEGORY_TO_BOARD_ID[category], sort);
  const bookmarkMutation = useToggleBookmark(CATEGORY_TO_BOARD_ID[category], sort);

  const handleToggleLike = (postId: number, isLike: boolean) => {
    likeMutation.mutate({ postId: postId, liked: isLike });
  };

  const handleToggleBookmark = (postId: number, isBookmark: boolean) => {
    bookmarkMutation.mutate({ postId: postId, isBookmarked: isBookmark });
  };

  return (
    <Container width={SCREEN_WIDTH}>
      <Wrap
        width={SCREEN_WIDTH}
        onPress={() => router.push({ pathname: '/(tabs)/community/[id]', params: { id: data.postId } })}
      >
        <PostHeader>
          <AuthorImageContainer>
            <PostUserProfileImg isAnonymous={data.isAnonymous} userImageUrl={data.userImageUrl} />
          </AuthorImageContainer>

          <Meta>
            <Author>{data.authorName}</Author>
            <SubRow>
              <TimeText>{timeToAgo(data.createdAt)}</TimeText>
              <CategoryBadge>
                <CategoryText>{CLIENT_CATEGORY_NAME[data.boardCategory]}</CategoryText>
              </CategoryBadge>
              <Dot>•</Dot>
              <IconBtn>
                <Icon size={16} type="eye" color="#848687" />
                <SmallCount>{data.viewCount}</SmallCount>
              </IconBtn>
            </SubRow>
          </Meta>

          <PostBookmarkButton
            isBookmarked={data.isBookmarked}
            onToggleBookmark={() => handleToggleBookmark(data.postId, data.isBookmarked)}
          />
        </PostHeader>

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

          <IconBtn onPress={() => onOpenModal(data.postId, data.authorId)}>
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
const PostHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;
const AuthorImageContainer = styled.View`
  width: 44px;
  height: 44px;
`;
const Meta = styled.View`
  margin-left: 8px;
  flex: 1;
`;
const Author = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B4_SB)}
`;
const SubRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;
const TimeText = styled.Text`
  color: ${({ theme }) => theme.colors.gray.gray_1};
  font-size: 11px;
  ${({ theme }) => textStyle(theme.fonts.small.small_M)}
`;
const CategoryBadge = styled.View`
  padding: 4px 6px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #184b3f;
`;
const CategoryText = styled.Text`
  color: ${({ theme }) => theme.colors.gray.lightGray_1};
  ${({ theme }) => textStyle(theme.fonts.small.small_M)}
`;
const Dot = styled.Text`
  color: ${({ theme }) => theme.colors.gray.gray_1};
`;
const SmallCount = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.small.small_M)}
  color: ${({ theme }) => theme.colors.gray.gray_1};
  font-size: 11px;
  margin-left: 4px;
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
  margin-right: 16px;
`;
