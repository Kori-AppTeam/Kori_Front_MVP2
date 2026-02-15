import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { useGetNewsCategories } from '../hooks/useGetNewsCategories';

type NewsCategoryProps = {
  value: string;
  onPress: (category: string) => void;
};

const NewsCategory = ({ value, onPress }: NewsCategoryProps) => {
  const { data: categories } = useGetNewsCategories();

  return (
    <Container
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 6, paddingHorizontal: 20 }}
    >
      {categories?.map(({ code, name }) => {
        const isActive = value === code;
        return (
          <CategoryButton key={code} active={isActive} onPress={() => onPress(code)}>
            <CategoryButtonText active={isActive}>{name}</CategoryButtonText>
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
