import Icon from '@/components/common/Icon';
import { COMMUNITY_ROUTER } from '@/src/shared/constants/route';
import { textStyle, theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';
import { SCREEN_WIDTH } from '../../shared/constants/constants';
import { BorderLine, Container, IconBtn } from '../../shared/styles/styles';
import { timeToAgo } from '../../shared/utils/indexUtils';
import { useMoreSheetStore } from '../store/useMoreSheetStore';
import { MyHistoryComment } from '../types';

type MyCommentCardProps = {
  authorId?: number;
  data: MyHistoryComment;
};

const MyCommentCard = ({ authorId, data }: MyCommentCardProps) => {
  const { showCommentMoreSheet } = useMoreSheetStore();

  return (
    <Container>
      <RowPress onPress={() => router.push(COMMUNITY_ROUTER.DETAIL(data.postId))}>
        <DateText>{timeToAgo(data.createdAt)}</DateText>
        <CommentContent numberOfLines={1}>{data.commentContent}</CommentContent>

        <BottomRow>
          <ParentSnippet numberOfLines={1}>{data.postContent}</ParentSnippet>
          <IconBtn
            onPress={() =>
              authorId && showCommentMoreSheet(data.postId, authorId, data.commentId, data.commentContent, false)
            }
          >
            <Icon type="eclipsisGaro" size={20} color={theme.colors.gray.gray_1} />
          </IconBtn>
        </BottomRow>
      </RowPress>
      <BorderLine width={SCREEN_WIDTH} />
    </Container>
  );
};

export default MyCommentCard;

const RowPress = styled.Pressable`
  width: 100%;
  gap: 20px;
  padding: 20px;
`;

const BottomRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DateText = styled.Text`
  color: ${theme.colors.gray.gray_1};
  ${({ theme }) => textStyle(theme.fonts.small.small_M)};
`;

const CommentContent = styled.Text`
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B3_L)};
`;

const ParentSnippet = styled.Text`
  color: #c5c5c5;
  ${({ theme }) => textStyle(theme.fonts.small.small_L)};
`;
