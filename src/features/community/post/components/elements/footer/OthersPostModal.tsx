import Icon from '@/components/common/Icon';
import {
  BottomSheetContent,
  ButtonContainer,
  ButtonText,
  ButtonWrap,
  Handle,
  HandleWrap,
} from '@/src/features/community/shared/styles/styles';
import { theme } from '@/src/styles/theme';
import React from 'react';

const OthersPostModal = ({
  closeModal,
  postId,
  authorId,
}: {
  closeModal: () => void;
  postId: number;
  authorId: number;
}) => {
  return (
    <BottomSheetContent>
      <HandleWrap>
        <Handle />
      </HandleWrap>
      <ButtonWrap>
        <ButtonContainer onPress={() => console.log('게시글 신고')}>
          <Icon type="alert" color={theme.colors.secondary.red} size={24} />
          <ButtonText color={theme.colors.secondary.red}>Report This Post</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => console.log('유저 신고')}>
          <Icon type="person" color={theme.colors.secondary.red} size={24} />
          <ButtonText color={theme.colors.secondary.red}>Report This User</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => closeModal()}>
          <Icon type="close" size={24} />
          <ButtonText>Cancel</ButtonText>
        </ButtonContainer>
      </ButtonWrap>
    </BottomSheetContent>
  );
};

export default OthersPostModal;
