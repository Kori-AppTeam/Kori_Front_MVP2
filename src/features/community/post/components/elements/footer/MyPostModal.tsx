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
import { usePostActions } from '../../../hooks/usePostActions';
import { useMoreSheetStore } from '../../../store/useMoreSheetStore';

const MyPostModal = () => {
  // 성공 시 모달 닫기
  const { handleDeletePost, handleRouterUpdatePost } = usePostActions();
  const { hideMoreSheet } = useMoreSheetStore();

  return (
    <BottomSheetContent>
      <HandleWrap>
        <Handle />
      </HandleWrap>
      <ButtonWrap>
        <ButtonContainer onPress={() => handleRouterUpdatePost()}>
          <Icon type="edit" size={24} />
          <ButtonText color={theme.colors.primary.white}>Edit</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => handleDeletePost()}>
          <Icon type="trashCan" color={theme.colors.secondary.red} size={24} />
          <ButtonText color={theme.colors.secondary.red}>Delete</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => hideMoreSheet()}>
          <Icon type="close" size={24} />
          <ButtonText>Cancel</ButtonText>
        </ButtonContainer>
      </ButtonWrap>
    </BottomSheetContent>
  );
};

export default MyPostModal;
