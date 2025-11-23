import Icon from '@/components/common/Icon';
import { textStyle } from '@/src/styles/theme';
import { router } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';
import { limitCount } from '../../utils/indexUtils';

type CommentProps = {
  showComment: boolean;
  postId: number;
  commentCount: number;
};

const PostComment = ({ showComment, postId, commentCount }: CommentProps) => {
  return (
    <IconBtn
      hitSlop={8}
      onPress={() =>
        showComment === false && router.push({ pathname: '/(tabs)/community/[id]', params: { id: postId } })
      }
    >
      <Icon size={20} type="comment" />
      <Count>{limitCount(commentCount)}</Count>
    </IconBtn>
  );
};

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

export default PostComment;
