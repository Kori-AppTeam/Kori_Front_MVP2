import Icon from '@/components/common/Icon';
import CustomBottomSheet from '@/src/shared/components/CustomBottomSheet';
import { textStyle, theme } from '@/src/styles/theme';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import styled from 'styled-components/native';

const PostMyPostModal = ({
  bottomSheetRef,
  closeModal,
}: {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  closeModal: () => void;
}) => {
  return (
    <CustomBottomSheet ref={bottomSheetRef}>
      <BottomSheetView>
        <ButtonContainer onPress={() => console.log('수정')}>
          <Icon type="edit" size={24} />
          <ButtonText color={theme.colors.primary.white}>Edit</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => console.log('삭제')}>
          <Icon type="trashCan" size={24} />
          <ButtonText color={theme.colors.secondary.red}>Delete</ButtonText>
        </ButtonContainer>

        <ButtonContainer onPress={() => closeModal()}>
          <Icon type="close" size={24} />
          <ButtonText>Cancel</ButtonText>
        </ButtonContainer>
      </BottomSheetView>
    </CustomBottomSheet>
  );
};

export default PostMyPostModal;

const ButtonContainer = styled.Pressable`
  width: 100%;
  padding: 14.5px 12px;
  row-gap: 4px;
  justify-content: start;
  align-items: center;
`;
const ButtonText = styled.Text<{ color?: string }>`
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)}
  color: ${({ theme, color }) => (color ? color : theme.colors.gray.lightGray_1)}
`;
