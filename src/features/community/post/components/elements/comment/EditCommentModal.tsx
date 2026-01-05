import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React, { useEffect } from 'react';
import { Modal, Pressable, View } from 'react-native';
import styled from 'styled-components/native';
import { useCommentActions } from '../../../hooks/comment/useCommentActions';
import { useEditCommentSheetStore } from '../../../store/useEditCommentSheetStore';

// 댓글 수정 모달 컴포넌트
const EditCommentModal = () => {
  const [editText, setEditText] = React.useState('');

  const {
    isEditCommentSheetVisible,
    commentContent,
    resetData: resetEditCommentSheetData,
  } = useEditCommentSheetStore();
  const { submitEditComment } = useCommentActions();

  // 모달이 열릴 때 초기값 설정
  useEffect(() => {
    if (isEditCommentSheetVisible && commentContent) {
      setEditText(commentContent);
    }
  }, [isEditCommentSheetVisible, commentContent]);

  // 모달이 완전히 닫힌 후 상태 초기화
  useEffect(() => {
    if (!isEditCommentSheetVisible) {
      setEditText('');
    }
  }, [isEditCommentSheetVisible]);

  // 저장 핸들러
  const handleSubmit = () => {
    if (!editText.trim()) {
      return;
    }

    // 수정된 텍스트를 submitEditComment에 전달
    submitEditComment(editText.trim());
  };

  return (
    <Modal
      visible={isEditCommentSheetVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={() => resetEditCommentSheetData()}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
      >
        <Pressable
          onPress={() => resetEditCommentSheetData()}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />
        <Dialog>
          <DialogHeader>
            <DialogTitle>
              <Icon type="edit" size={24} color={theme.colors.primary.white} />
              <DialogTitleText>Edit My Comments</DialogTitleText>
            </DialogTitle>
            <CloseBtn onPress={() => resetEditCommentSheetData()}>
              <Icon type="close" size={24} color={theme.colors.gray.lightGray_1} />
            </CloseBtn>
          </DialogHeader>

          <DialogTextarea
            value={editText}
            onChangeText={setEditText}
            placeholder="Edit your comment..."
            blurOnSubmit
            returnKeyType="done"
            placeholderTextColor={theme.colors.gray.darkGray_2}
            multiline
            textAlignVertical="top"
          />

          <SubmitBtn onPress={handleSubmit} disabled={!editText.trim()}>
            <SubmitText>Save Edit</SubmitText>
          </SubmitBtn>
        </Dialog>
      </View>
    </Modal>
  );
};

export default EditCommentModal;

const Dialog = styled.View`
  width: 100%;
  max-width: 360px;
  background: ${theme.colors.gray.darkGray_1_5};
  border-radius: 12px;
  padding: 12px 12px 20px 12px;
  gap: 12px;
`;
const DialogHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
`;
const DialogTitle = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
const DialogTitleText = styled.Text`
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)}
`;
const DialogTextarea = styled.TextInput`
  min-height: 220px;
  border-radius: 4px;
  padding: 16px;
  background: ${theme.colors.gray.darkGray_1};
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B2_R)}
`;
const SubmitBtn = styled.Pressable<{ disabled?: boolean }>`
  background: ${({ disabled }) => (disabled ? `${theme.colors.primary.mint}70` : theme.colors.primary.mint)};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  padding: 15px;
`;
const SubmitText = styled.Text`
  color: ${theme.colors.primary.black};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)}
`;
const CloseBtn = styled.Pressable`
  padding: 4px;
`;
