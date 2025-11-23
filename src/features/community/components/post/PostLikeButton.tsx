import Icon from '@/components/common/Icon';
import { textStyle } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { limitCount } from '../../utils/indexUtils';

type PostLikeButtonProps = {
  isLiked: boolean;
  likeCount: number;
  onToggleLike: () => void;
};

const PostLikeButton = ({ isLiked, likeCount, onToggleLike }: PostLikeButtonProps) => {
  return (
    <IconBtn onPress={() => onToggleLike()} hitSlop={8}>
      {isLiked ? <Icon size={20} type="thumbsUpSelected" /> : <Icon size={20} type="thumbsUpNonSelected" />}
      <Count>{limitCount(likeCount)}</Count>
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

export default PostLikeButton;
