import Icon from '@/components/common/Icon';
import { useGetNewsDetail } from '@/src/features/k-culture/hooks/useGetNewsDetail';
import { makeCompleteHtml } from '@/src/features/k-culture/utils/makeCompleteHtml';
import { confirmOpenURL } from '@/src/shared/utils/confirmOpenURL';
import { textStyle, theme } from '@/src/styles/theme';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import styled from 'styled-components/native';

const NewsId = () => {
  const { newsId } = useLocalSearchParams<{ newsId: string }>();
  const { data, isLoading, isError } = useGetNewsDetail(Number(newsId));

  const finalHtmlContent = useMemo(() => {
    if (!data) return '';
    return makeCompleteHtml(data.title, data.htmlContent);
  }, [data]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading news detail.</Text>
      </View>
    );
  }

  return (
    <Safe>
      <Header>
        <Back onPress={() => router.back()}>
          <Icon type="previous" size={24} color={theme.colors.gray.lightGray_1} />
        </Back>
        <HeaderTitle>{data.title}</HeaderTitle>
        <RightPlaceholder />
      </Header>

      <WebView
        contentWidth={SCREEN_WIDTH}
        source={{ html: finalHtmlContent }}
        onShouldStartLoadWithRequest={(event) => {
          if (event.url.startsWith('http') || event.url.startsWith('https')) {
            confirmOpenURL(event.url);
            return false;
          }
          return true;
        }}
      />
    </Safe>
  );
};

export default NewsId;

const Safe = styled.SafeAreaView`
  flex: 1;
  background: #1d1e1f;
  gap: 10px;
`;
const Header = styled.View`
  padding: 11px 20px 16px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Back = styled.Pressable`
  width: 40px;
  align-items: flex-start;
`;
const HeaderTitle = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B2_M)};
  color: ${({ theme }) => theme.colors.primary.white};
  text-align: center;
  flex: 1;
`;
const RightPlaceholder = styled.View`
  width: 40px;
`;
