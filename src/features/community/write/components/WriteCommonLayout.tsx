import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components/native';

interface WriteCommonLayoutProps {
  children: React.ReactNode;
  headerTitle: string;
  onSave: () => void;
  disabled?: boolean;
  saveText: string;
  bottomBar?: React.ReactNode;
}

const WriteCommonLayout = ({
  children,
  headerTitle,
  onSave,
  disabled,
  saveText,
  bottomBar,
}: WriteCommonLayoutProps) => {
  return (
    <Safe>
      <Header>
        <IconBtn onPress={() => router.back()}>
          <Icon type="previous" size={24} color={theme.colors.gray.lightGray_1} />
        </IconBtn>
        <HeaderTitle>{headerTitle}</HeaderTitle>
        <SaveBtn onPress={onSave} disabled={disabled}>
          <SaveText $enabled={!disabled}>{saveText}</SaveText>
        </SaveBtn>
      </Header>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 56 : 26}
      >
        {children}
        {bottomBar}
      </KeyboardAvoidingView>
    </Safe>
  );
};

export default WriteCommonLayout;

const Safe = styled.SafeAreaView`
  flex: 1;
  background: ${({ theme }) => theme.colors.primary.black};
`;
const Header = styled.View`
  padding: 5px 14px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const IconBtn = styled.Pressable`
  padding: 6px;
`;
const HeaderTitle = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B2_M)};
`;
const SaveBtn = styled.Pressable<{ disabled?: boolean }>`
  padding: 6px;
`;
const SaveText = styled.Text<{ $enabled: boolean }>`
  color: ${({ theme, $enabled }) => ($enabled ? theme.colors.primary.mint : theme.colors.gray.gray_1)};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
`;

export const BottomBar = styled.View`
  padding: 16px 20px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const BarLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;
export const BarRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;
export const BarIcon = styled.Pressable`
  align-items: center;
  justify-content: center;
`;
