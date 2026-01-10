import React, { useEffect, useState } from 'react';
import { StepContainer } from '@/src/features/profile-setup/styles/styles';
import InterestsTap from '@/src/features/profile-setup/components/InterestsStep/InterestsTap';
import styled from 'styled-components/native';
import {
  DUMMY_KDRAMA_AND_MOVIES_TAG_LIST,
  DUMMY_KPOP_TAG_LIST,
  DUMMY_LIFESTYLE_TAG_LIST,
} from '@/src/features/profile-setup/constants/constants';
import Tag from '@/src/shared/components/Tag';
import SelectedTagsList from '@/src/features/profile-setup/components/InterestsStep/SelectedTagsList';

const InterestsStep = () => {
  const [selectedTap, setSelectedTap] = useState<'K-Pop' | 'K-Drama & Movie' | 'Lifestyle'>('K-Pop');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagPress = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
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

const TagListScrollView = styled.ScrollView`
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
