import { K_CULTURE_ROUTER } from '@/src/shared/constants/route';
import { theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';
import { NEW_CATEGORY_MAPPER_NO_EMOJI } from '../constants/categoryMapper';
import { BottomRow, CategoryBadge, DateText, Description, Dot, NewsTitle } from '../styles/styles';
import { KNewsItemType } from '../types';
import { timeStampToAgo } from '../utils/timeStampToAgo';

type KNewsItemProps = {
  data: KNewsItemType;
};

const KNewsItem = ({ data }: KNewsItemProps) => {
  return (
    <Container onPress={() => router.push(K_CULTURE_ROUTER.DETAIL(data.contentId, data.type, data.ago))}>
      <ImageContainer>
        <Image source={{ uri: data.thumbImageUrl }} resizeMode="cover" />
      </ImageContainer>

      <Description>
        <NewsTitle numberOfLines={2}>{data.title}</NewsTitle>
        <BottomRow>
          <CategoryBadge>{NEW_CATEGORY_MAPPER_NO_EMOJI[data.type]}</CategoryBadge>
          <Dot>•</Dot>
          <DateText>{timeStampToAgo(data.ago)}</DateText>
        </BottomRow>
      </Description>
    </Container>
  );
};

export default KNewsItem;

const Container = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const ImageContainer = styled.View`
  width: 80px;
  aspect-ratio: 1;
  background-color: ${theme.colors.primary.white};
  border-radius: 8px;
`;

const Image = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;
