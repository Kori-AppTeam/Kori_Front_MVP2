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

interface OthersCommentModalProps {
  onBlock: () => void;
  onClose: () => void;
}

const OthersCommentModal = ({ onBlock, onClose }: OthersCommentModalProps) => {
  return (
    <BottomSheetContent>
      <HandleWrap>
        <Handle />
      </HandleWrap>
      <ButtonWrap>
        <ButtonContainer onPress={() => onBlock()}>
          <Icon type="person" color={theme.colors.secondary.red} size={24} />
          <ButtonText color={theme.colors.secondary.red}>Block This Comment</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => onClose()}>
          <Icon type="close" size={24} />
          <ButtonText>Cancel</ButtonText>
        </ButtonContainer>
      </ButtonWrap>
    </BottomSheetContent>
  );
};

export default OthersCommentModal;
