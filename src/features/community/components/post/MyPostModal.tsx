import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { useGetPostDetail } from '../../hooks/useGetPostDetail';
import { usePostActions } from '../../hooks/usePostActions';

const MyPostModal = ({ closeModal, postId }: { closeModal: () => void; postId: number }) => {
  // 성공 시 모달 닫기
  const { handleDeletePost, handleRouterUpdatePost } = usePostActions({
    onSuccessCallback: closeModal,
  });

  // 게시글 수정 위한 상세 게시글 정보
  const { postDetailData } = useGetPostDetail(postId);

  return (
    <BottomSheetView>
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
    </BottomSheetView>
  );
};

export default MyPostModal;

const BottomSheetView = styled.View`
  padding: 30px 20px 40px 20px;
  border-radius: 100px 100px 0 0;
`;
const ButtonContainer = styled.Pressable`
  width: 100%;
  padding: 16px 12px;
  flex-direction: row;
  gap: 4px;
  justify-content: start;
  align-items: center;
`;
const ButtonText = styled.Text<{ color?: string }>`
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)}
  color: ${({ theme, color }) => (color ? color : theme.colors.gray.lightGray_1)}
`;
