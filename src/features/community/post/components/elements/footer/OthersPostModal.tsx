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

interface OthersPostModalProps {
  onSuccessNavigate?: () => void;
  onReport: () => void;
  onBlock: (callback?: () => void) => void;
  onClose: () => void;
}

const OthersPostModal = ({ onSuccessNavigate, onReport, onBlock, onClose }: OthersPostModalProps) => {
  return (
    <BottomSheetContent>
      <HandleWrap>
        <Handle />
      </HandleWrap>
      <ButtonWrap>
        <ButtonContainer onPress={() => onReport()}>
          <Icon type="alert" color={theme.colors.secondary.red} size={24} />
          <ButtonText color={theme.colors.secondary.red}>Report This Post</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => onBlock(onSuccessNavigate)}>
          <Icon type="person" color={theme.colors.secondary.red} size={24} />
          <ButtonText color={theme.colors.secondary.red}>Block This User</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => onClose()}>
          <Icon type="close" size={24} />
          <ButtonText>Cancel</ButtonText>
        </ButtonContainer>
      </ButtonWrap>
    </BottomSheetContent>
  );
};

export default OthersPostModal;
