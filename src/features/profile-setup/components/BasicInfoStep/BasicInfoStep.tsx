import React, { useState } from 'react';
import Input from '@/src/shared/components/Input';
import { FieldLabel, Field, StepContainer } from '@/src/features/profile-setup/styles/styles';
import DropdownInput from '@/src/shared/components/DropdownInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDropdownBottomSheet } from '@/src/features/profile-setup/hooks/useDropdownBottomSheet';
import GenderSelect from '@/src/features/profile-setup/components/BasicInfoStep/GenderSelect';
import CountryPickerBottomSheet from '@/src/features/profile-setup/components/BasicInfoStep/bottomSheet/CountryPickerBottomSheet';
import LanguagePickerBottomSheet from '@/src/features/profile-setup/components/BasicInfoStep/bottomSheet/LanguagePickerBottomSheet';
import styled from 'styled-components/native';
import { Controller, useFormContext } from 'react-hook-form';
import { ProfileSetupFormValues } from '@/src/features/profile-setup/types';
import BirthInput from '@/src/shared/components/BirthInput';
import BirthPicker from '@/src/shared/components/BirthPicker';

const BasicInfoStep = () => {
  const { control, watch, setValue } = useFormContext<ProfileSetupFormValues>();
  const [showBirthPicker, setShowBirthPicker] = useState(false);

  const selectedCountry = watch('country');
  const selectedLanguages = watch('language') ?? [];
  const birthday = watch('birthday') ?? '';
  const selectedLanguagesLabel = selectedLanguages.map((lang) => lang).join(', ');

  const handleSelectedCountry = (country: string) => {
    setValue('country', country, { shouldDirty: true, shouldValidate: true });
  };

  const handleSelectedLanguages = (languages: string[]) => {
    setValue('language', languages, { shouldDirty: true, shouldValidate: true });
  };

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
        <BasicInfoStepContainer>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input placeholder="First Name" registerField="firstname" />
            <Input placeholder="Last Name" registerField="lastname" />
          </Field>
          <Field>
            <FieldLabel>Birth</FieldLabel>
            <BirthInput value={birthday} onPress={() => setShowBirthPicker(true)} />
          </Field>
          <Field>
            <FieldLabel>Gender</FieldLabel>
            <Controller
              control={control}
              name="gender"
              render={({ field: { value, onChange } }) => <GenderSelect value={value} onChange={onChange} />}
            />
          </Field>
          <Field>
            <FieldLabel>Country</FieldLabel>
            <DropdownInput
              label="Select Country"
              isOpen={isCountryPickerOpen}
              value={selectedCountry || undefined}
              onPress={() => handleCountryDropdown()}
            />
          </Field>
          <Field>
            <FieldLabel>Language</FieldLabel>
            <DropdownInput
              label="Select Language"
              isOpen={isLanguagePickerOpen}
              value={selectedLanguagesLabel || undefined}
              selectedCount={selectedLanguages.length}
              maxCount={5}
              onPress={() => handleLanguageDropdown()}
            />
          </Field>
        </BasicInfoStepContainer>
      </KeyboardAwareScrollView>
      <CountryPickerBottomSheet
        bottomSheetRef={countryBottomSheetRef}
        onBottomSheetClose={() => setIsCountryPickerOpen(false)}
        selectedCountry={selectedCountry}
        onSelectCountry={(country) => handleSelectedCountry(country)}
      />
      <LanguagePickerBottomSheet
        bottomSheetRef={languageBottomSheetRef}
        onBottomSheetClose={() => setIsLanguagePickerOpen(false)}
        selectedLanguages={selectedLanguages}
        onSelectLanguage={(languages) => handleSelectedLanguages(languages)}
      />

      <BirthPicker
        isShow={showBirthPicker}
        onClose={() => setShowBirthPicker(false)}
        date={birthday}
        setDate={(date) => setValue('birthday', date, { shouldDirty: true, shouldValidate: true })}
      />
    </>
  );
};

export default BasicInfoStep;

const BasicInfoStepContainer = styled(StepContainer)`
  padding-bottom: 40px;
`;
