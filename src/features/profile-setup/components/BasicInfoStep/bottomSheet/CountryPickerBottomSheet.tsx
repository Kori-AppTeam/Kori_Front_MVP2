import React, { useCallback, useMemo, useState } from 'react';
import CustomBottomSheet from '@/src/shared/components/CustomBottomSheet';
import { useBottomSheetKeyboardControl } from '@/src/shared/hooks/useBottomSheetKeyboardControl';

import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import { COUNTRIES } from '@/src/utils/countries';
import { Dimensions, FlatList } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
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

interface CountryPickerBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  onBottomSheetClose: () => void;
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
}

const CountryPickerBottomSheet = ({
  bottomSheetRef,
  onBottomSheetClose,
  selectedCountry,
  onSelectCountry,
}: CountryPickerBottomSheetProps) => {
  const [search, setSearch] = useState<string>('');
  const { height: deviceHeight } = Dimensions.get('window');

  const {
    onChange,
    onAnimate: onAnimateKeyboard,
    dismissAfterKeyboard,
  } = useBottomSheetKeyboardControl(bottomSheetRef);

  // 국가 목록 필터링
  const countries = useMemo(() => {
    const list = COUNTRIES.slice().sort();
    if (!search.trim()) return list;
    return list.filter((country) => country.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  // 검색어 초기화
  const handleClearSearch = useCallback(() => setSearch(''), []);

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

  // 국가 리스트 항목 렌더링
  const renderCountryItem = ({ item }: { item: string }) => {
    const selected = selectedCountry === item;

    const toggle = (country: string) => {
      if (selectedCountry === country) {
        onSelectCountry('');
      } else {
        onSelectCountry(country);
      }

      dismissAfterKeyboard();
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
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <PickerBottomSheetContent onStartShouldSetResponder={() => true}>
        <PickerBottomSheetHeader>
          <PickerBottomSheetHandle />
          <SearchInput
            placeholder="Search your country"
            search={search}
            setSearch={setSearch}
            handleClearSearch={handleClearSearch}
          />
        </PickerBottomSheetHeader>

        <PickerListWrapper height={deviceHeight}>
          {countries.length > 0 ? (
            <FlatList
              data={countries}
              renderItem={renderCountryItem}
              keyExtractor={(item, index) => `${item}-${index}`}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <NoResultText>No countries found.</NoResultText>
          )}
        </PickerListWrapper>
      </PickerBottomSheetContent>
    </CustomBottomSheet>
  );
};

export default CountryPickerBottomSheet;
