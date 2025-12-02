import Icon from '@/components/common/Icon';
import { AllowedClientCategory } from '@/src/features/community/post/types';
import { WRITE_CATEGORIES } from '@/src/features/community/shared/constants/constants';
import {
  BottomSheetContent,
  CategoryItem,
  CategoryItemText,
  CategoryListContainer,
  Divider,
  Handle,
  HandleWrap,
} from '@/src/features/community/shared/styles/styles';
import { theme } from '@/src/styles/theme';
import React, { useEffect } from 'react';
import { FlatList, Keyboard } from 'react-native';

interface CategoryBottomSheetContentProps {
  selectedCategory: AllowedClientCategory;
  onSelect: (category: AllowedClientCategory) => void;
  onClose: () => void;
}

export function CategoryBottomSheetContent({ selectedCategory, onSelect, onClose }: CategoryBottomSheetContentProps) {
  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  const handleSelect = (category: AllowedClientCategory) => {
    onSelect(category);
    onClose();
  };

  return (
    <BottomSheetContent>
      <HandleWrap>
        <Handle />
      </HandleWrap>
      <CategoryListContainer>
        <FlatList
          data={WRITE_CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <CategoryItem onPress={() => handleSelect(item)}>
              <CategoryItemText active={item === selectedCategory}>{item}</CategoryItemText>
              {item === selectedCategory ? <Icon type="check" size={20} color={theme.colors.primary.mint} /> : null}
            </CategoryItem>
          )}
          ItemSeparatorComponent={() => <Divider />}
          showsVerticalScrollIndicator={false}
        />
      </CategoryListContainer>
    </BottomSheetContent>
  );
}
