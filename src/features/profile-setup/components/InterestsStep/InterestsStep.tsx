import React, { useEffect, useMemo, useState } from 'react';
import InterestsTap from '@/src/features/profile-setup/components/InterestsStep/InterestsTap';
import styled from 'styled-components/native';
import Tag from '@/src/shared/components/Tag';
import SelectedTagsList from '@/src/features/profile-setup/components/InterestsStep/SelectedTagsList';
import { useFormContext } from 'react-hook-form';
import { ProfileSetupFormValues } from '@/src/features/profile-setup/types';
import { useProfileOptionsStore } from '@/src/features/profile-setup/store/useProfileOptions';

const InterestsStep = () => {
  const categories = useProfileOptionsStore((s) => s.interestCategories);

  const tabs = useMemo(() => categories.map((c) => c.category), [categories]);
  const [selectedTap, setSelectedTap] = useState<string>('');

  useEffect(() => {
    if (selectedTap) return;
    if (tabs.length === 0) return;
    setSelectedTap(tabs[0]);
  }, [tabs, selectedTap]);

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
      <InterestsTap tabs={tabs} selectedTap={selectedTap} onSelectTap={setSelectedTap} />
      <TagListScrollView>
        <InterestTagWrapper>
          {(categories.find((c) => c.category === selectedTap)?.items ?? []).map((tag) => (
            <Tag key={tag} label={tag} selected={selectedTags.includes(tag)} onPress={handleTagPress} />
          ))}
        </InterestTagWrapper>
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
