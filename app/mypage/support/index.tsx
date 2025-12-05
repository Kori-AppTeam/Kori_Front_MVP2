import Icon from '@/components/common/Icon';
import ReportButton from '@/src/features/mypage/components/ReportButton';
import { useGetSupportUrl } from '@/src/features/mypage/hooks/useGetSupportUrl';
import { textStyle, theme } from '@/src/styles/theme';
import { openURL } from 'expo-linking';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

const SupportPage = () => {
  const { data, isLoading, isError, refetch } = useGetSupportUrl();

  const renderContent = () => {
    if (isLoading) {
      return (
        <Content center={true}>
          <ActivityIndicator size="large" />
        </Content>
      );
    }

    if (isError || !data) {
      return (
        <Content center={true}>
          <Text>Failed to load support page.</Text>
          <ErrorButton onPress={() => refetch()} activeOpacity={0.8}>
            <ErrorButtonText>Retry</ErrorButtonText>
          </ErrorButton>
        </Content>
      );
    }

    return (
      <Content center={false}>
        <ReportButton
          title="User Feedback"
          description="Share your thoughts about our app"
          onPress={() => openURL(data.feedbackUrl)}
        />

        <ReportButton title="Report a Bug" onPress={() => openURL(data.bugReportUrl)} />
      </Content>
    );
  };

  return (
    <Safe>
      <Header>
        <IconBtn onPress={() => router.back()} activeOpacity={0.8}>
          <Icon type="previous" size={24} color={theme.colors.gray.lightGray_1} />
        </IconBtn>
        <HeaderTitle>Feedback & Support</HeaderTitle>
      </Header>

      {renderContent()}
    </Safe>
  );
};

export default SupportPage;

const Safe = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary.black};
`;
const Header = styled.View`
  padding: 10px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 16px;
`;
const IconBtn = styled.TouchableOpacity`
  padding: 5px;
  position: absolute;
  left: 15px;
`;
const HeaderTitle = styled.Text`
  padding: 6px 38px;
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B2_M)};
`;
const Content = styled.View<{ center?: boolean }>`
  flex: 1;
  padding: 0 20px;
  align-items: ${({ center }) => (center ? 'center' : 'stretch')};
  justify-content: ${({ center }) => (center ? 'center' : 'flex-start')};
`;
const Text = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
`;
const ErrorButton = styled.TouchableOpacity`
  margin-top: 12px;
  padding: 10px 16px;
  background-color: ${({ theme }) => theme.colors.primary.mint};
  border-radius: 6px;
`;
const ErrorButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.black};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
`;
