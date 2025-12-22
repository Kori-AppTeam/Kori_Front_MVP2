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

const OthersPostModal = () => {
  const { handleReportPost, handleBlockUser } = usePostActions();
  const { hideMoreSheet } = useMoreSheetStore();

  return (
    <BottomSheetContent>
      <HandleWrap>
        <Handle />
      </HandleWrap>
      <ButtonWrap>
        <ButtonContainer onPress={() => handleReportPost()}>
          <Icon type="alert" color={theme.colors.secondary.red} size={24} />
          <ButtonText color={theme.colors.secondary.red}>Report This Post</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => handleBlockUser()}>
          <Icon type="person" color={theme.colors.secondary.red} size={24} />
          <ButtonText color={theme.colors.secondary.red}>Block This User</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => hideMoreSheet()}>
          <Icon type="close" size={24} />
          <ButtonText>Cancel</ButtonText>
        </ButtonContainer>
      </ButtonWrap>
    </BottomSheetContent>
  );
};

export default OthersPostModal;
