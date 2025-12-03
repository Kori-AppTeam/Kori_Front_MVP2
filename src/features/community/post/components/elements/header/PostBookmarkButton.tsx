import Icon from '@/components/common/Icon';
import React from 'react';
import styled from 'styled-components/native';
import useVisitor from '../../../hooks/useVisitor';

type PostBookmarkButtonProps = {
  isBookmarked: boolean;
  onToggleBookmark: () => void;
};

const PostBookmarkButton = ({ isBookmarked, onToggleBookmark }: PostBookmarkButtonProps) => {
  const { handleBlockVisitor } = useVisitor();

  return (
    <BookmarkBtn onPress={() => handleBlockVisitor(onToggleBookmark)} hitSlop={8}>
      {isBookmarked ? <Icon size={20} type="bookmarkSelected" /> : <Icon size={20} type="bookmarkNonSelected" />}
    </BookmarkBtn>
  );
};

export default PostBookmarkButton;

const BookmarkBtn = styled.TouchableOpacity``;
