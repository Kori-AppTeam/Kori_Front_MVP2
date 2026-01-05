import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { NEWS_CATEGORIES, NEWS_CATEGORY_MAPPER } from '../constants/categoryMapper';
import { NewsType } from '../types';

type NewsCategoryProps = {
  value: NewsType;
  onPress: (category: NewsType) => void;
};

const NewsCategory = ({ value, onPress }: NewsCategoryProps) => {
  return (
    <Container
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 6, paddingHorizontal: 20 }}
    >
      {NEWS_CATEGORIES.map((key) => {
        const isActive = value === key;
        return (
          <CategoryButton key={key} active={isActive} onPress={() => onPress(key)}>
            <CategoryButtonText active={isActive}>{NEWS_CATEGORY_MAPPER[key]}</CategoryButtonText>
          </CategoryButton>
        );
      })}
    </Container>
  );
};

export default NewsCategory;

const Container = styled.ScrollView`
  width: 100%;
  flex-direction: row;
  max-height: 40px;
`;

const CategoryButton = styled.Pressable<{ active?: boolean }>`
  padding: 10px 12px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ active }) => (active ? theme.colors.primary.mint : theme.colors.gray.darkGray_1_5)};
  border-radius: 8px;
`;

const CategoryButtonText = styled.Text<{ active?: boolean }>`
  color: ${({ active }) => (active ? theme.colors.primary.mint : theme.colors.gray.lightGray_1)};
  ${({ theme }) => textStyle(theme.fonts.body.B4_R)};
`;
