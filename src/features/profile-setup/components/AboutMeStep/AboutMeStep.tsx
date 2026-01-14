import React, { useState } from 'react';
import TextArea from '@/src/shared/components/TextArea';
import { StepContainer } from '@/src/features/profile-setup/styles/styles';
import AboutMeSuggestions from '@/src/features/profile-setup/components/AboutMeStep/AboutMeSuggestions';

const AboutMeStep = () => {
  const [text, setText] = useState<string>('');
  const handleSuggestionChangeText = (suggestion: string) => {
    setText(suggestion);
  };
  return (
    <StepContainer>
      <TextArea placeholder="Describe yourself here" limit={70} value={text} onChangeText={setText} />
      <AboutMeSuggestions onPressSuggestion={handleSuggestionChangeText} />
    </StepContainer>
  );
};

export default AboutMeStep;
