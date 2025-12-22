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

interface MyPostModalProps {
  onSuccessNavigate?: () => void;
  onDelete: (callback?: () => void) => void;
  onEdit: () => void;
  onClose: () => void;
}

const MyPostModal = ({ onSuccessNavigate, onDelete, onEdit, onClose }: MyPostModalProps) => {
  return (
    <BottomSheetContent>
      <HandleWrap>
        <Handle />
      </HandleWrap>
      <ButtonWrap>
        <ButtonContainer onPress={() => onEdit()}>
          <Icon type="edit" size={24} />
          <ButtonText color={theme.colors.primary.white}>Edit</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => onDelete(onSuccessNavigate)}>
          <Icon type="trashCan" color={theme.colors.secondary.red} size={24} />
          <ButtonText color={theme.colors.secondary.red}>Delete</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => onClose()}>
          <Icon type="close" size={24} />
          <ButtonText>Cancel</ButtonText>
        </ButtonContainer>
      </ButtonWrap>
    </BottomSheetContent>
  );
};

export default MyPostModal;
