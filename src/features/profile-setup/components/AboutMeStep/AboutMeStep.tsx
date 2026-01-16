import React from 'react';
import TextArea from '@/src/shared/components/TextArea';
import { StepContainer } from '@/src/features/profile-setup/styles/styles';
import AboutMeSuggestions from '@/src/features/profile-setup/components/AboutMeStep/AboutMeSuggestions';
import { useFormContext } from 'react-hook-form';
import { ProfileSetupFormValues } from '@/src/features/profile-setup/types';

const AboutMeStep = () => {
  const { watch, setValue } = useFormContext<ProfileSetupFormValues>();
  const text = watch('introduction') ?? '';

  // textarea 변경 시 폼 업데이트
  const handleChangeText = (next: string) => {
    setValue('introduction', next, { shouldDirty: true, shouldValidate: true });
  };

  // 추천 문구 선택 시 폼 업데이트
  const handleSuggestionChangeText = (suggestion: string) => {
    setValue('introduction', suggestion, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <StepContainer>
      <TextArea placeholder="Describe yourself here" limit={70} value={text} onChangeText={handleChangeText} />
      <AboutMeSuggestions onPressSuggestion={handleSuggestionChangeText} />
    </StepContainer>
  );
};

export default AboutMeStep;
