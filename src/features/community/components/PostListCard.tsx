import AnonymityImage from '@/assets/images/character_04.svg';
import Icon from '@/components/common/Icon';
import { CLIENT_CATEGORY_NAME } from '@/lib/community/constants';
import { router } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';
import { PostsListItem } from '../types/postsListType';
import { timeToAgo } from '../utils/indexUtils';
import UserProfileImg from './UserProfileImg';

type Props = {
  data: PostsListItem;
  onPress?: () => void;
  onToggleLike?: () => void;
  onToggleBookmark?: () => void;
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

  return (
    <Wrap onPress={props.onPress}>
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
            <Icon size={16} type="eye" color="gray" />
            <SmallCount>{viewCount}</SmallCount>
          </SubRow>
        </Meta>

        <BookmarkBtn onPress={props.onToggleBookmark} hitSlop={8}>
          {isBookmarked ? <Icon size={20} type="bookmarkSelected" /> : <Icon size={20} type="bookmarkNonSelected" />}
        </BookmarkBtn>
      </PostHeader>

      {/* 여기 이미지 처리 */}

      <FooterRow>
        <IconBtn onPress={props.onToggleLike} hitSlop={8}>
          {isLiked ? <Icon size={20} type="thumbsUpSelected" /> : <Icon size={16} type="thumbsUpNonSelected" />}
          <Count>{likeCount}</Count>
        </IconBtn>

        <IconBtn
          hitSlop={8}
          onPress={() => router.push({ pathname: '/(tabs)/community/[id]', params: { id: postId } })}
        >
          <Icon size={20} type="comment" />
          <Count>{commentCount}</Count>
        </IconBtn>

        <More>···</More>
      </FooterRow>
    </Wrap>
  );
}

const Wrap = styled.Pressable`
  padding: 10px 16px;
  border-bottom-width: 1px;
  border-bottom-color: #222426;
  gap: 8px;
`;
const PostHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;
const AuthorImageContainer = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #2a2b2c;
`;
const Meta = styled.View`
  margin-left: 10px;
  flex: 1;
`;
const Author = styled.Text`
  color: #fff;
  font-size: 13px;
  font-family: 'PlusJakartaSans_700Bold';
  margin-bottom: 5px;
`;
const SubRow = styled.View`
  margin-top: 2px;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;
const TimeText = styled.Text`
  color: #9aa0a6;
  font-size: 11px;
`;
const CategoryBadge = styled.View`
  padding: 3px 8px;
  border-radius: 4px;
  background: #184b3f;
`;
const CategoryText = styled.Text`
  color: #e9e9e9;
  font-size: 11px;
  font-family: 'PlusJakartaSans_600SemiBold';
`;
const Dot = styled.Text`
  color: #848687;
  font-size: 16;
`;
const SmallCount = styled.Text`
  color: #cfd4da;
  font-size: 11px;
  margin-left: 4px;
`;
const BookmarkBtn = styled.Pressable`
  padding: 6px;
`;

const CarouselBox = styled.View`
  margin-top: 8px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
`;
const Slide = styled.View``;

const Counter = styled.Text`
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 11px;
`;

const Title = styled.Text`
  color: #fff;
  font-size: 15px;
  font-family: 'PlusJakartaSans_700Bold';
`;
const Body = styled.Text`
  color: #d9dcdf;
  font-size: 15px;
  line-height: 18px;
`;
const FooterRow = styled.View`
  margin-top: 6px;
  flex-direction: row;
  align-items: center;
`;
const IconBtn = styled.Pressable`
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
`;
const Count = styled.Text`
  color: #cfd4da;
  margin-left: 6px;
  font-size: 14px;
`;
const More = styled.Text`
  margin-left: auto;
  color: #9aa0a6;
  font-size: 18px;
  padding: 4px 6px;
`;
