import { K_CULTURE_ROUTER } from '@/src/shared/constants/route';
import { textStyle, theme } from '@/src/styles/theme';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { memo } from 'react';
import styled from 'styled-components/native';
import { BottomRow, CategoryBadge, DateText, Description, Dot, NewsTitle } from '../styles/styles';
import { NewsPreviewItem } from '../types';
import { timeStampToAgo } from '../utils/timeStampToAgo';

type TrendingNewsItemProps = {
  item: NewsPreviewItem;
  index: number;
};

const TrendingNewsItem = ({ item, index }: TrendingNewsItemProps) => {
  const imageContainerWidth = SCREEN_WIDTH * (160 / 375);

  return (
    <NewsItemContainer
      width={imageContainerWidth}
      onPress={() => router.push(K_CULTURE_ROUTER.DETAIL(item.contentId, item.type, item.ago))}
    >
      <NewsImageContainer>
        <NewsImage source={{ uri: item.thumbImageUrl }} resizeMode="cover" />
        <LinearGradient
          colors={[theme.colors.gray.darkGray_1, 'rgba(29, 30, 31, 0)']}
          start={{ x: 0.5, y: 1.0 }}
          end={{ x: 0.5, y: 0.0 }}
          locations={[0, 1]}
          style={{
            opacity: 0.4,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        ></LinearGradient>
        <RankBadge>{index + 1}</RankBadge>
      </NewsImageContainer>

      <Description>
        <Title numberOfLines={2}>{item.title}</Title>
        <BottomRow>
          <CategoryBadge>{item.type ?? 'K-News'}</CategoryBadge>
          <Dot>•</Dot>
          <DateText>{timeStampToAgo(item.ago)}</DateText>
        </BottomRow>
      </Description>
    </NewsItemContainer>
  );
};

export default memo(TrendingNewsItem);

const NewsItemContainer = styled.Pressable<{ width: number }>`
  width: ${({ width }) => width}px;
  min-height: ${160 / 199}px;
`;

const NewsImageContainer = styled.View`
  width: 100%;
  aspect-ratio: ${4 / 3};
  background-color: ${theme.colors.primary.white};
  border-radius: 10px;
  position: relative;
`;

const NewsImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

const RankBadge = styled.Text`
  position: absolute;
  bottom: -18px;
  left: 10px;
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.headline.H1_BI)};
`;

const Title = styled(NewsTitle)`
  margin-top: 26px;
`;
