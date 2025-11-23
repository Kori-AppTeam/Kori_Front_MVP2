import React from 'react';
import styled from 'styled-components/native';

type PostMoreButtonProps = {
  postId: number;
  authorId?: number;
};

const PostMoreButton = ({ postId, authorId }: PostMoreButtonProps) => {
  return <More>···</More>;
};
const More = styled.Text`
  margin-left: auto;
  color: #9aa0a6;
  font-size: 18px;
`;

export default PostMoreButton;
