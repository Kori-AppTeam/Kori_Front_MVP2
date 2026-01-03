import Icon from '@/components/common/Icon';
import { IconBtn } from '@/src/features/community/shared/styles/styles';
import KNewsList from '@/src/features/k-culture/components/KNewsList';
import NewsCategory from '@/src/features/k-culture/components/NewsCategory';
import SortDropDown from '@/src/features/k-culture/components/SortDropdown';
import TrendingNews from '@/src/features/k-culture/components/TrendingNews';
import { NewsSortType, NewsType } from '@/src/features/k-culture/types';
import { textStyle, theme } from '@/src/styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components/native';

const Index = () => {
  // const insets = useSafeAreaInsets(); 노치까지 고려한 헤더 높이
  const [selectedCategory, setSelectedCategory] = useState<NewsType>('K-POP');
  const [sort, setSort] = useState<NewsSortType>('TRENDING');

  const staticHeader = React.memo(() => {
    return <></>;
  });

  const renderHeader = useMemo(
    () => (
      <>
        {/* <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" /> */}
        <Header source={require('@/assets/images/k_news_bg.png')} resizeMode="cover">
          <LinearGradient
            colors={[
              `${theme.colors.primary.mint}33`,
              `${theme.colors.secondary.blue}33`,
              `${theme.colors.primary.purple}33`,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flex: 1,
              // paddingTop: insets.top
            }}
          >
            <HeaderNav>
              <Back onPress={() => router.back()}>
                <Icon type="previous" size={24} color={theme.colors.gray.lightGray_1} />
              </Back>
              <HeaderTitle>K-News</HeaderTitle>
              {/* <IconBtn onPress={() => router.push(K_CULTURE_ROUTER.SEARCH)}>
              <Icon type="search" size={24} color={theme.colors.gray.lightGray_1} />
            </IconBtn> */}
              <RightPlaceholder />
            </HeaderNav>
            <TrendingNews />
          </LinearGradient>
        </Header>
        <HeaderWrapper>
          <NewsCategory value={selectedCategory} onPress={setSelectedCategory} />
          <SortDropDown value={sort} onPress={setSort} />
        </HeaderWrapper>
      </>
    ),
    [selectedCategory, sort],
  );

  return (
    <Container>
      <KNewsList category={selectedCategory} sort={sort} renderHeader={renderHeader} />
    </Container>
  );
};

export default Index;

const Container = styled.View`
  flex: 1;
  background: #1d1e1f;
`;

const Header = styled.ImageBackground`
  width: 100%;
  /* 노치 문제 해결되면 사용 */
  /* aspect-ratio: ${375 / 360}; */
  aspect-ratio: ${375 / 309};
`;

const HeaderNav = styled.View`
  padding: 0 20px;
  margin-top: 11px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Back = styled(IconBtn)`
  width: 40px;
`;

const HeaderTitle = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B2_M)};
  color: ${({ theme }) => theme.colors.primary.white};
  flex: 1;
  text-align: center;
`;

const RightPlaceholder = styled.View`
  width: 40px;
`;

const HeaderWrapper = styled.View`
  padding: 24px 0;
  gap: 24px;
`;
