import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React, { useEffect } from 'react';
import { Modal, Pressable, View } from 'react-native';
import styled from 'styled-components/native';
import { usePostActions } from '../hooks/usePostActions';
import { useReportSheetStore } from '../store/useReportSheetStore';
import { BlockReportPostParams } from '../types';

// 게시글 신고 모달 컴포넌트
const ReportModal = () => {
  const [reason, setReason] = React.useState<BlockReportPostParams>({
    reasonCategory: '',
    reasonDetail: '',
  });

  const { isReportSheetVisible, selectedReportTarget, resetData: resetReportSheetData } = useReportSheetStore();

  const { submitReportPost } = usePostActions();

  // 모달이 완전히 닫힌 후 상태 초기화
  useEffect(() => {
    if (!isReportSheetVisible) {
      setReason({ reasonCategory: '', reasonDetail: '' });
    }
  }, [isReportSheetVisible]);

  // 신고 제출 핸들러
  const handleSubmit = () => {
    if (!reason.reasonDetail.trim()) {
      return;
    }

    submitReportPost(reason);
  };

  // 4. UI 텍스트 동적 처리
  const getModalTitle = () => {
    switch (selectedReportTarget) {
      case 'user':
        return 'Report This User';
      case 'comment':
        return 'Report This Comment';
      default:
        return 'Report This Post';
    }
  };

  return (
    <Modal
      visible={isReportSheetVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={() => resetReportSheetData()}
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
          onPress={() => resetReportSheetData()}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />
        <Dialog>
          <DialogHeader>
            <DialogTitle>
              <Icon type="alert" size={24} color={theme.colors.secondary.red} />
              <DialogTitleText $danger>{getModalTitle()}</DialogTitleText>
            </DialogTitle>
            <CloseBtn onPress={() => resetReportSheetData()}>
              <Icon type="close" size={24} color={theme.colors.gray.lightGray_1} />
            </CloseBtn>
          </DialogHeader>

          <DialogTextarea
            value={reason.reasonDetail}
            onChangeText={(text) => setReason({ ...reason, reasonDetail: text })}
            placeholder={
              selectedReportTarget === 'user'
                ? 'Tell us what’s wrong with this user’s content…'
                : selectedReportTarget === 'comment'
                  ? 'Tell us what’s wrong with this comment…'
                  : 'Tell us what’s wrong with this post…'
            }
            blurOnSubmit
            returnKeyType="done"
            placeholderTextColor="#858b90"
            multiline
            textAlignVertical="top"
          />

          <SubmitBtn onPress={handleSubmit} disabled={!reason.reasonDetail.trim()}>
            <SubmitText>Submit</SubmitText>
          </SubmitBtn>
        </Dialog>
      </View>
    </Modal>
  );
};

export default ReportModal;

const Dialog = styled.View`
  width: 100%;
  max-width: 360px;
  background: ${theme.colors.gray.darkGray_1_5};
  border-radius: 12px;
  padding: 12px;
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
  gap: 4px;
`;
const DialogTitleText = styled.Text<{ $danger?: boolean }>`
  color: ${({ $danger }) => ($danger ? theme.colors.secondary.red : '#e7eaed')};
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
  background: ${({ disabled }) => (disabled ? theme.colors.gray.darkGray_2 : theme.colors.secondary.red)};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  padding: 15px;
`;
const SubmitText = styled.Text`
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)}
`;
const CloseBtn = styled.Pressable`
  padding: 4px;
`;
