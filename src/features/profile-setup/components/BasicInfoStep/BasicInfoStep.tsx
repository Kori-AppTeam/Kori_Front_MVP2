import Input from '@/src/shared/components/Input';
import React, { useEffect, useState } from 'react';
import { FieldLabel, Field, StepContainer } from '@/src/features/profile-setup/styles/styles';
import DropdownInput from '@/src/shared/components/DropdownInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDropdownBottomSheet } from '@/src/features/profile-setup/hooks/useDropdownBottomSheet';
import GenderSelect from '@/src/features/profile-setup/components/BasicInfoStep/GenderSelect';
import CountryPickerBottomSheet from '@/src/features/profile-setup/components/BasicInfoStep/bottomSheet/CountryPickerBottomSheet';
import LanguagePickerBottomSheet from '@/src/features/profile-setup/components/BasicInfoStep/bottomSheet/LanguagePickerBottomSheet';

const BasicInfoStep = () => {
  const {
    bottomSheetRef: countryBottomSheetRef,
    isPickerOpen: isCountryPickerOpen,
    setIsPickerOpen: setIsCountryPickerOpen,
    handleDropdown: handleCountryDropdown,
  } = useDropdownBottomSheet();

  const {
    bottomSheetRef: languageBottomSheetRef,
    isPickerOpen: isLanguagePickerOpen,
    setIsPickerOpen: setIsLanguagePickerOpen,
    handleDropdown: handleLanguageDropdown,
  } = useDropdownBottomSheet();

  return (
    <>
      <KeyboardAwareScrollView enableOnAndroid keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <StepContainer>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input placeholder="First Name" />
            <Input placeholder="Last Name" />
          </Field>
          <Field>
            <FieldLabel>Gender</FieldLabel>
            <GenderSelect gender="Male" />
          </Field>
          <Field>
            <FieldLabel>Country</FieldLabel>
            <DropdownInput
              label="Select Country"
              isOpen={isCountryPickerOpen}
              value={undefined}
              onPress={() => handleCountryDropdown()}
            />
          </Field>
          <Field>
            <FieldLabel>Language</FieldLabel>
            <DropdownInput
              label="Select Language"
              isOpen={isLanguagePickerOpen}
              value={undefined}
              selectedCount={0}
              maxCount={5}
              onPress={() => handleLanguageDropdown()}
            />
          </Field>
        </StepContainer>
      </KeyboardAwareScrollView>
      <CountryPickerBottomSheet
        bottomSheetRef={countryBottomSheetRef}
        onBottomSheetClose={() => setIsCountryPickerOpen(false)}
        selectedCountry={''}
        onSelectCountry={() => null}
      />
      <LanguagePickerBottomSheet
        bottomSheetRef={languageBottomSheetRef}
        onBottomSheetClose={() => setIsLanguagePickerOpen(false)}
        selectedLanguages={[]}
        onSelectLanguage={() => null}
      />
    </>
  );
};

export default BasicInfoStep;
