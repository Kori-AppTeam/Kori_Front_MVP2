import Icon from '@/components/common/Icon';
import { Count, FooterRow, IconBtn, LeftFooter } from '@/src/features/community/shared/styles/styles';
import { limitCount } from '@/src/features/community/shared/utils/indexUtils';
import React from 'react';
import { PostCommonFooterProps } from '../../../types';

const PostCommonFooter = ({
  isLiked,
  likeCount,
  onToggleLike,
  onToggleComment,
  commentCount,
  onOpenModal,
}: PostCommonFooterProps) => {
  return (
    <FooterRow>
      <LeftFooter>
        <IconBtn onPress={onToggleLike} hitSlop={8}>
          {isLiked ? <Icon size={20} type="thumbsUpSelected" /> : <Icon size={20} type="thumbsUpNonSelected" />}
          <Count>{limitCount(likeCount)}</Count>
        </IconBtn>

        <IconBtn hitSlop={8} onPress={onToggleComment}>
          <Icon size={20} type="comment" />
          <Count>{limitCount(commentCount)}</Count>
        </IconBtn>
      </LeftFooter>

      <IconBtn onPress={onOpenModal}>
        <Icon type="eclipsisGaro" size={20} />
      </IconBtn>
    </FooterRow>
  );
};

export default PostCommonFooter;
