import Icon from '@/components/common/Icon';
import { CLIENT_CATEGORY_NAME } from '@/src/features/community/shared/constants/constants';
import { timeToAgo } from '@/src/features/community/shared/utils/indexUtils';
import { textStyle, theme } from '@/src/styles/theme';
import React, { memo } from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { PostCommonHeaderProps } from '../../../types';
import PostUserProfileImg from './PostUserProfileImg';

const PostCommonHeader = ({
  showProfileModal = false,
  onShowProfileModal,
  authorId,
  isAnonymous,
  userImageUrl,
  authorName,
  createdAt,
  boardCategory,
  viewCount,
  isBookmarked,
  onToggleBookmark,
}: PostCommonHeaderProps) => {
  return (
    <PostHeader>
      {/* 나의 게시글 조회 시에는 필요 없으므로 분기처리 */}
      {isAnonymous !== undefined && userImageUrl !== undefined && (
        <AuthorImageContainer disabled={!showProfileModal || isAnonymous} onPress={onShowProfileModal}>
          <PostUserProfileImg isAnonymous={isAnonymous} userImageUrl={userImageUrl} />
        </AuthorImageContainer>
      )}

      <Meta author={authorName}>
        {authorName !== undefined && <Author>{authorName}</Author>}
        <SubRow>
          <TimeText>{timeToAgo(createdAt)}</TimeText>
          {boardCategory !== undefined && (
            <CategoryBadge>
              <CategoryText>{CLIENT_CATEGORY_NAME[boardCategory]}</CategoryText>
            </CategoryBadge>
          )}
          <Dot>•</Dot>
          <IconBtn>
            <Icon size={16} type="eye" color={theme.colors.gray.gray_1} />
            <SmallCount>{viewCount}</SmallCount>
          </IconBtn>
        </SubRow>
      </Meta>

      {/* 북마크 필요 유무 확인 후 isBookmarked값에 따라 버튼 렌더링 */}
      {isBookmarked !== undefined && (
        <IconBtn onPress={onToggleBookmark} hitSlop={8}>
          {isBookmarked ? <Icon size={20} type="bookmarkSelected" /> : <Icon size={20} type="bookmarkNonSelected" />}
        </IconBtn>
      )}
    </PostHeader>
  );
};

export default memo(PostCommonHeader);

const PostHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  width: 100%;
`;
const AuthorImageContainer = styled(Pressable)`
  width: 44px;
  height: 44px;
`;
const Meta = styled.View<{ author?: string | null }>`
  margin-left: ${({ author }) => (author ? '8px' : '0')};
  flex: 1;
  gap: 4px;
  flex-direction: column;
  justify-content: start;
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
const IconBtn = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
