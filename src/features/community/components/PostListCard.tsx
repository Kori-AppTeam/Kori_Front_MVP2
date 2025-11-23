import AnonymityImage from '@/assets/images/character_04.svg';
import Icon from '@/components/common/Icon';
import { CATEGORY_TO_BOARD_ID, CLIENT_CATEGORY_NAME } from '@/lib/community/constants';
import { textStyle } from '@/src/styles/theme';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import styled from 'styled-components/native';
import { useToggleBookmark } from '../hooks/useToggleBookmark';
import { useToggleLike } from '../hooks/useToggleLike';
import { AllowedCategory, PostsListItem, SortParam } from '../types/postsListType';
import { timeToAgo } from '../utils/indexUtils';
import UserProfileImg from './UserProfileImg';
import PostBookmarkButton from './post/PostBookmarkButton';
import PostComment from './post/PostComment';
import PostLikeButton from './post/PostLikeButton';
import PostTextContent from './post/PostTextContent';
import SingleImage from './post/SingleImage';

type PostCardProps = {
  data: PostsListItem;
  sort: SortParam;
  category: AllowedCategory;
};

export default function PostListCard({ data, sort, category }: PostCardProps) {
  const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);
  const [truncate, setTruncate] = useState({ numberOfLines: 0 });

  const onGetLines = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      const lines = e.nativeEvent.lines.length;
      setTruncate({ numberOfLines: lines });
    },
    [data.contentPreview],
  );

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
            {!data.isAnonymous && data.userImageUrl ? (
              <UserProfileImg source={data.userImageUrl} />
            ) : (
              <UserProfileImg source={AnonymityImage} />
            )}
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
            <SingleImage
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

          <More>···</More>
        </FooterRow>
      </Wrap>
      <BorderLine width={SCREEN_WIDTH} />
    </Container>
  );
}

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
  margin-left: 10px;
  flex: 1;
`;
const Author = styled.Text`
  color: #fff;
  font-size: 13px;
  font-family: 'PlusJakartaSans_700Bold';
`;
const SubRow = styled.View`
  margin-top: 5px;
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
  padding: 3px 8px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #184b3f;
  opacity: 0.8;
  color: ${({ theme }) => theme.colors.gray.lightGray_1};
`;
const CategoryText = styled.Text`
  color: #e9e9e9;
  font-size: 11px;
  font-family: 'PlusJakartaSans_600SemiBold';
`;
const Dot = styled.Text`
  color: ${({ theme }) => theme.colors.gray.gray_1};
  font-size: 16;
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
`;
const LeftFooter = styled.View`
  flex-direction: row;
  align-items: center;
  row-gap: 16;
`;
const IconBtn = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;
const More = styled.Text`
  margin-left: auto;
  color: #9aa0a6;
  font-size: 18px;
`;
