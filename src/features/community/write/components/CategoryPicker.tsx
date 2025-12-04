import Icon from '@/components/common/Icon';
import { AllowedClientCategory } from '@/src/features/community/post/types';
import { WRITE_CATEGORIES } from '@/src/features/community/shared/constants/constants';
import { textStyle, theme } from '@/src/styles/theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { FlatList, Modal } from 'react-native';
import styled from 'styled-components/native';
import { CategoryBottomSheetProps } from '../types';

export function CategoryBottomSheet({
  visible,
  selectedCategory,
  onSelect,
  onClose,
  disabled = false,
}: CategoryBottomSheetProps) {
  const handleSelect = (category: AllowedClientCategory) => {
    onSelect(category);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Overlay activeOpacity={1} onPress={onClose}>
        <Sheet onStartShouldSetResponder={() => true}>
          <HandleWrap>
            <Handle />
          </HandleWrap>
          <FlatList
            data={WRITE_CATEGORIES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <CatSheetItem onPress={() => handleSelect(item)}>
                <CatSheetItemText active={item === selectedCategory}>{item}</CatSheetItemText>
                {item === selectedCategory ? <AntDesign name="check" size={20} color="#30F59B" /> : null}
              </CatSheetItem>
            )}
            ItemSeparatorComponent={() => <Divider />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </Sheet>
      </Overlay>
    </Modal>
  );
}

interface CategorySelectorProps {
  category: AllowedClientCategory;
  onPress: () => void;
  disabled?: boolean;
}

export function CategorySelector({ category, onPress, disabled = false }: CategorySelectorProps) {
  return (
    <CatContainer>
      <CatLabel>Category</CatLabel>
      <CatRow onPress={onPress} disabled={disabled} pointerEvents="box-only">
        <CatChip style={disabled ? { opacity: 0.5 } : undefined}>
          <CatText>{category}</CatText>
          <Icon type="arrowTransparent" size={20} color={theme.colors.gray.gray_1} />
        </CatChip>
      </CatRow>
    </CatContainer>
  );
}

const CatContainer = styled.View`
  width: 100%;
  gap: 12px;
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({ theme }) => theme.colors.gray.darkGray_1};
`;
const CatRow = styled.Pressable<{ disabled?: boolean }>`
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
`;
const CatLabel = styled.Text`
  color: ${({ theme }) => theme.colors.gray.gray_1};
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
`;
const CatChip = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
const CatText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B2_M)};
`;
const Overlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;
const Sheet = styled.View`
  background-color: #353637;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  max-height: 70%;
  padding-bottom: 20px;
`;
const HandleWrap = styled.View`
  align-items: center;
  padding: 20px 20px 10px 20px;
`;
const Handle = styled.View`
  width: 40px;
  height: 4px;
  background-color: #949899;
  border-radius: 2px;
`;
const CatSheetItem = styled.Pressable<{ active?: boolean }>`
  padding: 16px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const CatSheetItemText = styled.Text<{ active?: boolean }>`
  color: ${(p) => (p.active ? '#e6e9ec' : '#cfd4da')};
  font-size: 16px;
  font-family: 'PlusJakartaSans-Regular';
  flex: 1;
`;
const Divider = styled.View`
  height: 1px;
  background: #4a4b4c;
`;
