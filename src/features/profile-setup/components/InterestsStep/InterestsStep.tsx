import React, { useState } from 'react';
import InterestsTap from '@/src/features/profile-setup/components/InterestsStep/InterestsTap';
import styled from 'styled-components/native';
import {
  DUMMY_KDRAMA_AND_MOVIES_TAG_LIST,
  DUMMY_KPOP_TAG_LIST,
  DUMMY_LIFESTYLE_TAG_LIST,
} from '@/src/features/profile-setup/constants/constants';
import Tag from '@/src/shared/components/Tag';
import SelectedTagsList from '@/src/features/profile-setup/components/InterestsStep/SelectedTagsList';
import { useFormContext } from 'react-hook-form';
import { ProfileSetupFormValues } from '@/src/features/profile-setup/types';

type InterestTap = 'K-Pop' | 'K-Drama & Movie' | 'Lifestyle';

const InterestsStep = () => {
  const [selectedTap, setSelectedTap] = useState<InterestTap>('K-Pop');

  const { watch, setValue } = useFormContext<ProfileSetupFormValues>();
  const selectedTags = watch('hobby') ?? [];

  const handleTagPress = (tag: string) => {
    if (selectedTags.includes(tag)) {
      const next = selectedTags.filter((t) => t !== tag);
      setValue('hobby', next, { shouldDirty: true, shouldValidate: true });
    } else {
      if (selectedTags.length >= 5) return;
      const next = [...selectedTags, tag];
      setValue('hobby', next, { shouldDirty: true, shouldValidate: true });
    }
  };

  return (
    <StepContainer>
      <InterestsTap selectedTap={selectedTap} onSelectTap={setSelectedTap} />
      <TagListScrollView>
        {selectedTap === 'K-Pop' && (
          <InterestTagWrapper>
            {DUMMY_KPOP_TAG_LIST.map((tag) => (
              <Tag key={tag} label={tag} selected={selectedTags.includes(tag)} onPress={handleTagPress} />
            ))}
          </InterestTagWrapper>
        )}
        {selectedTap === 'K-Drama & Movie' && (
          <InterestTagWrapper>
            {DUMMY_KDRAMA_AND_MOVIES_TAG_LIST.map((tag) => (
              <Tag key={tag} label={tag} selected={selectedTags.includes(tag)} onPress={handleTagPress} />
            ))}
          </InterestTagWrapper>
        )}
        {selectedTap === 'Lifestyle' && (
          <InterestTagWrapper>
            {DUMMY_LIFESTYLE_TAG_LIST.map((tag) => (
              <Tag key={tag} label={tag} selected={selectedTags.includes(tag)} onPress={handleTagPress} />
            ))}
          </InterestTagWrapper>
        )}
      </TagListScrollView>
      <SelectedTagsList
        selectedCount={selectedTags.length}
        maxCount={5}
        value={selectedTags}
        onTagPress={handleTagPress}
      />
    </StepContainer>
  );
};

export default InterestsStep;

export const StepContainer = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 12px;
`;

const TagListScrollView = styled.ScrollView.attrs({ contentContainerStyle: { paddingBottom: 60 } })`
  height: 100%;
`;

const InterestTagWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  flex-wrap: wrap;
  gap: 8px;
  row-gap: 10px;
`;
