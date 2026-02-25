import React, { useCallback, useMemo, useState } from 'react';

import Icon from '@/components/common/Icon';
import SearchInput from '@/src/features/profile-setup/components/BasicInfoStep/bottomSheet/SearchInput';
import {
  NoResultText,
  PickerBottomSheetContent,
  PickerBottomSheetHandle,
  PickerBottomSheetHeader,
  PickerListItem,
  PickerListText,
  PickerListWrapper,
} from '@/src/features/profile-setup/components/BasicInfoStep/bottomSheet/styles';
import CustomBottomSheet from '@/src/shared/components/CustomBottomSheet';
import { useBottomSheetKeyboardControl } from '@/src/shared/hooks/useBottomSheetKeyboardControl';
import { theme } from '@/src/styles/theme';
import { LANGUAGES } from '@/src/utils/languages';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Dimensions } from 'react-native';

interface LanguagePickerBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  onBottomSheetClose: () => void;
  selectedLanguages: string[];
  onSelectLanguage: (languages: string[]) => void;
}

const LanguagePickerBottomSheet = ({
  bottomSheetRef,
  onBottomSheetClose,
  selectedLanguages,
  onSelectLanguage,
}: LanguagePickerBottomSheetProps) => {
  const [search, setSearch] = useState<string>('');
  const { height: deviceHeight } = Dimensions.get('window');

  const {
    onChange,
    onAnimate: onAnimateKeyboard,
    dismissAfterKeyboard,
  } = useBottomSheetKeyboardControl(bottomSheetRef, { restoreIndex: 0 });

  // 언어 목록 필터링
  const languages = useMemo(() => {
    const list = LANGUAGES.slice().sort();
    if (!search.trim()) return list;
    return list.filter((lang) => lang.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  // 검색어 초기화
  const handleClearSearch = () => setSearch('');

  // 바텀시트 닫힘 애니메이션 콜백
  const onAnimate = useCallback(
    (_fromIndex: number, toIndex: number) => {
      onAnimateKeyboard(_fromIndex, toIndex);
      if (toIndex === -1) {
        onBottomSheetClose();
      }
    },
    [onAnimateKeyboard, onBottomSheetClose],
  );

  // 언어 리스트 항목 렌더링
  const renderFlatListItem = ({ item }: { item: string }) => {
    const selected = selectedLanguages.includes(item);

    // 언어 선택/해제 토글 함수
    const toggle = (lang: string) => {
      const exists = selectedLanguages.includes(lang);
      if (exists) {
        onSelectLanguage(selectedLanguages.filter((v) => v !== lang));
      } else {
        if (selectedLanguages.length >= 5) return;
        const nextSelected = [...selectedLanguages, lang];
        onSelectLanguage(nextSelected);

        // 5개가 되는 순간에만 키보드를 닫고 바텀시트를 닫음
        if (nextSelected.length === 5) {
          dismissAfterKeyboard();
        }
      }
    };

    return (
      <PickerListItem selected={selected} onPress={() => toggle(item)}>
        <PickerListText>{item}</PickerListText>
        {selected && <Icon type="check" size={20} color={theme.colors.primary.mint} />}
      </PickerListItem>
    );
  };

  return (
    <CustomBottomSheet
      ref={bottomSheetRef}
      onChange={onChange}
      onAnimate={onAnimate}
      snapPoints={['60%']}
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <PickerBottomSheetContent>
        <PickerBottomSheetHeader>
          <PickerBottomSheetHandle />
          <SearchInput
            placeholder="Search your language"
            search={search}
            setSearch={setSearch}
            handleClearSearch={handleClearSearch}
          />
        </PickerBottomSheetHeader>

        <PickerListWrapper height={deviceHeight}>
          {languages.length > 0 ? (
            <BottomSheetFlatList
              data={languages}
              renderItem={renderFlatListItem}
              keyExtractor={(item, index) => `${item}-${index}`}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <NoResultText>No languages found.</NoResultText>
          )}
        </PickerListWrapper>
      </PickerBottomSheetContent>
    </CustomBottomSheet>
  );
};

export default LanguagePickerBottomSheet;
