import Icon from '@/components/common/Icon';
import { IconBtn } from '@/src/features/community/shared/styles/styles';
import { useGetNewsDetail } from '@/src/features/k-culture/hooks/useGetNewsDetail';
import { CategoryBadge, DateText, Dot } from '@/src/features/k-culture/styles/styles';
import { makeCompleteHtml } from '@/src/features/k-culture/utils/makeCompleteHtml';
import { timeStampToAgo } from '@/src/features/k-culture/utils/timeStampToAgo';
import { confirmOpenURL } from '@/src/shared/utils/confirmOpenURL';
import { textStyle, theme } from '@/src/styles/theme';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import styled from 'styled-components/native';

const NewsId = () => {
  const {
    newsId,
    type = 'K-news',
    ago = '0',
  } = useLocalSearchParams<{
    newsId: string;
    type?: string;
    ago?: string;
  }>();
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
        <HeaderNav>
          <Back onPress={() => router.back()}>
            <Icon type="previous" size={24} color={theme.colors.gray.lightGray_1} />
          </Back>
          <HeaderTitle>K-News</HeaderTitle>
          <RightPlaceholder />
        </HeaderNav>

        <Description>
          <NewsTitle>{data.title}</NewsTitle>
          <BottomRow>
            <CategoryBadge>{type}</CategoryBadge>
            <Dot>•</Dot>
            <DateText>{timeStampToAgo(Number(ago))}</DateText>
          </BottomRow>
        </Description>
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
  background-color: ${theme.colors.primary.black};
`;
const Header = styled.View`
  align-items: center;
`;
const HeaderNav = styled.View`
  width: 100%;
  padding: 11px 20px 10px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.colors.primary.black};
`;
const HeaderTitle = styled.Text`
  flex: 1;
  text-align: center;
  ${({ theme }) => textStyle(theme.fonts.body.B2_M)};
  color: ${({ theme }) => theme.colors.primary.white};
`;
const Description = styled.View`
  width: 100%;
  padding: 20px;
  gap: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.gray.darkGray_1};
`;
const BottomRow = styled.View`
  width: 100%;
  flex-direction: row;
  gap: 6px;
  align-items: center;
  justify-content: flex-start;
`;
const RightPlaceholder = styled.View`
  width: 40px;
`;
const Back = styled(IconBtn)`
  width: 40px;
`;
const NewsTitle = styled.Text`
  flex-shrink: 1;
  ${({ theme }) => textStyle(theme.fonts.body.B2_M)};
  color: ${({ theme }) => theme.colors.primary.white};
`;
