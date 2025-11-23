import Icon from '@/components/common/Icon';
import React from 'react';
import styled from 'styled-components/native';

type PostBookmarkButtonProps = {
  isBookmarked: boolean;
  onToggleBookmark: () => void;
};

const PostBookmarkButton = ({ isBookmarked, onToggleBookmark }: PostBookmarkButtonProps) => {
  return (
    <BookmarkBtn onPress={() => onToggleBookmark()} hitSlop={8}>
      {isBookmarked ? <Icon size={20} type="bookmarkSelected" /> : <Icon size={20} type="bookmarkNonSelected" />}
    </BookmarkBtn>
  );
};

const BookmarkBtn = styled.TouchableOpacity``;

export default PostBookmarkButton;
