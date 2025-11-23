import Icon from '@/components/common/Icon';
import React from 'react';
import styled from 'styled-components/native';

type PostMoreButtonProps = {
  postId: number;
  authorId?: number;
};

const PostMoreButton = ({ postId, authorId }: PostMoreButtonProps) => {
  return (
    <IconBtn>
      <Icon type="eclipsisGaro" size={20} />
    </IconBtn>
  );
};

const IconBtn = styled.Pressable`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default PostMoreButton;
