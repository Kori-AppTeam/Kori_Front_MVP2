import Icon from '@/components/common/Icon';
import { COMMUNITY_ROUTER } from '@/src/features/community/shared/constants/constants';
import { textStyle } from '@/src/styles/theme';
import { router } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';
import { limitCount } from '../../../../shared/utils/indexUtils';
import useVisitor from '../../../hooks/useVisitor';

type CommentProps = {
  showComment: boolean;
  postId: number;
  commentCount: number;
};

const PostComment = ({ showComment, postId, commentCount }: CommentProps) => {
  const { handleBlockVisitor } = useVisitor();

  const handlePress = () => {
    if (showComment) return;
    handleBlockVisitor(() => router.push({ pathname: COMMUNITY_ROUTER['DETAIL'], params: { id: postId } }));
  };

  return (
    <IconBtn hitSlop={8} onPress={handlePress}>
      <Icon size={20} type="comment" />
      <Count>{limitCount(commentCount)}</Count>
    </IconBtn>
  );
};

export default PostComment;

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
