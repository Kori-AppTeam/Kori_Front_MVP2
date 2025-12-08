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
import { useGetPostDetail } from '../../../hooks/useGetPostDetail';
import { usePostActions } from '../../../hooks/usePostActions';

const MyPostModal = ({ closeModal, postId }: { closeModal: () => void; postId: number }) => {
  const { postDetailData } = useGetPostDetail(postId);

  // 성공 시 모달 닫기
  const { handleDeletePost, handleRouterUpdatePost } = usePostActions({
    onSuccessCallback: closeModal,
  });

  return (
    <BottomSheetContent>
      <HandleWrap>
        <Handle />
      </HandleWrap>
      <ButtonWrap>
        <ButtonContainer onPress={() => handleRouterUpdatePost(postId, postDetailData)}>
          <Icon type="edit" size={24} />
          <ButtonText color={theme.colors.primary.white}>Edit</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => handleDeletePost(postId)}>
          <Icon type="trashCan" color={theme.colors.secondary.red} size={24} />
          <ButtonText color={theme.colors.secondary.red}>Delete</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => closeModal()}>
          <Icon type="close" size={24} />
          <ButtonText>Cancel</ButtonText>
        </ButtonContainer>
      </ButtonWrap>
    </BottomSheetContent>
  );
};

export default MyPostModal;
