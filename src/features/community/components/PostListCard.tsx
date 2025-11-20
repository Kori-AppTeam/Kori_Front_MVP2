import AnonymityImage from '@/assets/images/character_04.svg';
import Icon from '@/components/common/Icon';
import { CLIENT_CATEGORY_NAME } from '@/lib/community/constants';
import { textStyle } from '@/src/styles/theme';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import styled from 'styled-components/native';
import { PostsListItem } from '../types/postsListType';
import { limitCount, timeToAgo } from '../utils/indexUtils';
import UserProfileImg from './UserProfileImg';
import SingleImage from './post/SingleImage';

type Props = {
  data: PostsListItem;
  onToggleBookmark: () => void;
  onToggleLike: () => void;
};

export default function PostListCard(props: Props) {
  const {
    postId,
    contentPreview,
    authorId,
    authorName,
    boardCategory,
    createdAt,
    isAnonymous,
    isBookmarked,
    isLiked,
    likeCount,
    commentCount,
    viewCount,
    userImageUrl,
    contentImageUrl,
    imageCount,
    score,
  } = props.data;

  const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);
  const [truncate, setTruncate] = useState({ numberOfLines: 0 });

  const onGetLines = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      const lines = e.nativeEvent.lines.length;
      setTruncate({ numberOfLines: lines });
    },
    [contentPreview],
  );

  const handlePostPress = (postId: number) => {
    router.push({ pathname: '/(tabs)/community/[id]', params: { id: postId } });
  };

  return (
    <Container width={SCREEN_WIDTH}>
      <Wrap width={SCREEN_WIDTH} onPress={() => handlePostPress(postId)}>
        <PostHeader>
          <AuthorImageContainer>
            {!isAnonymous && userImageUrl ? (
              <UserProfileImg source={userImageUrl} />
            ) : (
              <UserProfileImg source={AnonymityImage} />
            )}
          </AuthorImageContainer>

          <Meta>
            <Author>{authorName}</Author>
            <SubRow>
              <TimeText>{timeToAgo(createdAt)}</TimeText>
              <CategoryBadge>
                <CategoryText>{CLIENT_CATEGORY_NAME[boardCategory]}</CategoryText>
              </CategoryBadge>
              <Dot>•</Dot>
              <IconBtn>
                <Icon size={16} type="eye" color="#848687" />
                <SmallCount>{viewCount}</SmallCount>
              </IconBtn>
            </SubRow>
          </Meta>

          <BookmarkBtn onPress={() => props.onToggleBookmark()} hitSlop={8}>
            {isBookmarked ? <Icon size={20} type="bookmarkSelected" /> : <Icon size={20} type="bookmarkNonSelected" />}
          </BookmarkBtn>
        </PostHeader>

        <ContentBox>
          {contentImageUrl && (
            <SingleImage imageUrl={contentImageUrl} imageCount={imageCount} pageWidth={SCREEN_WIDTH - 20 * 2} />
          )}

          <ContentText>
            <HiddenText onTextLayout={onGetLines}>{contentPreview}</HiddenText>
            <Body numberOfLines={2} ellipsizeMode="tail">
              {contentPreview}
            </Body>
            {truncate.numberOfLines > 2 ? (
              <MoreContent onPress={() => router.push({ pathname: '/(tabs)/community/[id]', params: { id: postId } })}>
                <MoreContentText>more</MoreContentText>
              </MoreContent>
            ) : null}
          </ContentText>
        </ContentBox>

        <FooterRow>
          <LeftFooter>
            <IconBtn onPress={() => props.onToggleLike()} hitSlop={8}>
              {isLiked ? <Icon size={20} type="thumbsUpSelected" /> : <Icon size={20} type="thumbsUpNonSelected" />}
              <Count>{limitCount(likeCount)}</Count>
            </IconBtn>

            <IconBtn
              hitSlop={8}
              onPress={() => router.push({ pathname: '/(tabs)/community/[id]', params: { id: postId } })}
            >
              <Icon size={20} type="comment" />
              <Count>{limitCount(commentCount)}</Count>
            </IconBtn>
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
const BookmarkBtn = styled.TouchableOpacity``;
const ContentBox = styled.View`
  width: 100%;
  padding: 20px 0;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
`;
const ContentText = styled.View`
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  gap: 4px;
`;
const Body = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  width: 100%;
  text-align: left;
  font-size: 15px;
  ${({ theme }) => textStyle(theme.fonts.body.B3_L)}/* line-height: 18px; */
`;
const MoreContent = styled.Pressable``;
const MoreContentText = styled.Text`
  color: #cccfd0;
  text-decoration-line: underline;
  ${({ theme }) => textStyle(theme.fonts.body.B4_R)}
`;
const HiddenText = styled.Text`
  position: absolute;
  opacity: 0;
  z-index: -100;
  pointer-events: none;
  font-size: 15px;
  /* line-height: 18px; */
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
const Count = styled.Text`
  color: #cfd4da;
  margin-left: 6px;
  ${({ theme }) => textStyle(theme.fonts.body.B4_M)}
`;
const More = styled.Text`
  margin-left: auto;
  color: #9aa0a6;
  font-size: 18px;
`;
