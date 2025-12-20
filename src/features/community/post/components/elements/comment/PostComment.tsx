import Icon from '@/components/common/Icon';
import { Count, IconBtn, LeftFooter } from '@/src/features/community/shared/styles/styles';
import { limitCount, timeToAgo } from '@/src/features/community/shared/utils/indexUtils';
import { textStyle } from '@/src/styles/theme';
import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { Comment } from '../../../types';
import PostUserProfileImg from '../header/PostUserProfileImg';

interface PostCommentProps {
  data: Comment;
  onShowProfileModal: () => void;
  onToggleLike: () => void;
  onOpenModal: () => void;
}

const PostComment = ({ data, onShowProfileModal, onToggleLike, onOpenModal }: PostCommentProps) => {
  return (
    <Container>
      {data.parentCommentId && <Icon size={20} type="commentArrow" />}
      {data.isAnonymous !== undefined && data.userImage !== undefined && (
        <AuthorImageContainer disabled={data.isAnonymous} onPress={onShowProfileModal}>
          <PostUserProfileImg isAnonymous={data.isAnonymous} userImageUrl={data.userImage} />
        </AuthorImageContainer>
      )}

      <ContentColumn>
        <Meta>
          <Author>{data.authorName}</Author>
          <TimeText>{timeToAgo(data.createdAt)}</TimeText>
        </Meta>

        <Text>{data.content}</Text>

        <FooterRow>
          <LeftFooter>
            <IconBtn onPress={onToggleLike} hitSlop={8}>
              {data.isLiked ? (
                <Icon size={20} type="thumbsUpSelected" />
              ) : (
                <Icon size={20} type="thumbsUpNonSelected" />
              )}
              <Count>{limitCount(data.likeCount)}</Count>
            </IconBtn>

            {!data.parentCommentId && (
              <IconBtn hitSlop={8}>
                <Icon size={20} type="comment" />
              </IconBtn>
            )}
          </LeftFooter>

          <IconBtn onPress={onOpenModal}>
            <Icon type="eclipsisGaro" size={20} />
          </IconBtn>
        </FooterRow>
      </ContentColumn>
    </Container>
  );
};

export default PostComment;

const Container = styled.View`
  padding: 0 20px;
  flex-direction: row;
  gap: 8px;
`;
const AuthorImageContainer = styled(Pressable)`
  width: 32px;
  height: 32px;
`;
const ContentColumn = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
`;
const Meta = styled.View`
  gap: 4px;
  flex-direction: column;
  justify-content: flex-start;
`;
const Author = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B4_SB)}
`;
const TimeText = styled.Text`
  color: ${({ theme }) => theme.colors.gray.gray_1};
  font-size: 11px;
  ${({ theme }) => textStyle(theme.fonts.small.small_M)}
`;
const Text = styled.Text`
  padding: 16px 0;
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B4_L)}
`;
export const FooterRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
