import Icon from '@/components/common/Icon';
import { limitCount } from '@/src/features/community/shared/utils/indexUtils';
import { textStyle } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
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

const FooterRow = styled.View`
  width: 100%;
  padding: 0 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const LeftFooter = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;
const IconBtn = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 2px;
`;
const Count = styled.Text`
  color: #cfd4da;
  margin-left: 6px;
  ${({ theme }) => textStyle(theme.fonts.body.B4_M)}
`;
