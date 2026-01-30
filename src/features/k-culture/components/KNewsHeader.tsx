import Icon from '@/components/common/Icon';
import { IconBtn } from '@/src/features/community/shared/styles/styles';
import { K_CULTURE_ROUTER } from '@/src/shared/constants/route';
import { textStyle, theme } from '@/src/styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';
import { NewsSortType, NewsType } from '../types';
import NewsCategory from './NewsCategory';
import SortDropDown from './SortDropdown';
import TrendingNews from './TrendingNews';

type KNewsHeaderProps = {
  selectedCategory: NewsType;
  setSelectedCategory: (category: NewsType) => void;
  sort: NewsSortType;
  setSort: (sort: NewsSortType) => void;
};

const KNewsHeader = ({ selectedCategory, setSelectedCategory, sort, setSort }: KNewsHeaderProps) => {
  return (
    <>
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
          }}
        >
          <HeaderNav>
            <IconBtn onPress={() => router.back()}>
              <Icon type="previous" size={24} color={theme.colors.gray.lightGray_1} />
            </IconBtn>
            <HeaderTitle>K-News</HeaderTitle>
            <IconBtn onPress={() => router.push(K_CULTURE_ROUTER.SEARCH)}>
              <Icon type="search" size={24} color={theme.colors.gray.lightGray_1} />
            </IconBtn>
          </HeaderNav>
          <TrendingNews />
        </LinearGradient>
      </Header>
      <HeaderWrapper>
        <NewsCategory value={selectedCategory} onPress={setSelectedCategory} />
        <SortDropDown value={sort} onPress={setSort} />
      </HeaderWrapper>
    </>
  );
};

export default KNewsHeader;

const Header = styled.ImageBackground`
  width: 100%;
`;

const HeaderNav = styled.View`
  padding: 0 20px;
  margin-top: 11px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const HeaderTitle = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B2_M)};
  color: ${({ theme }) => theme.colors.primary.white};
  flex: 1;
  text-align: center;
`;

const HeaderWrapper = styled.View`
  padding: 24px 0;
  gap: 24px;
`;
