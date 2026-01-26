import { AllowedCategory } from '@/src/features/community/post/types';
import { CLIENT_CATEGORY_NAME } from '@/src/features/community/shared/constants/constants';
import React from 'react';
import styled from 'styled-components/native';

const CATS: AllowedCategory[] = ['ALL', 'QUIZ', 'VOTE', 'NEWS', 'TIP', 'QNA', 'EVENT', 'FREE_TALK', 'ACTIVITY'];

type Props = {
  value: AllowedCategory;
  onPress: (c: AllowedCategory) => void;
};

export default function CategoryChips({ value, onPress }: Props) {
  return (
    <Row horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
      {CATS.map((c) => {
        const active = c === value;
        return (
          <Chip key={c} $active={active} onPress={() => onPress(c)}>
            <ChipText $active={active}>{CLIENT_CATEGORY_NAME[c]}</ChipText>
          </Chip>
        );
      })}
    </Row>
  );
}

const Row = styled.ScrollView`
  padding: 8px 12px 0 10px;
  gap: 8px;
` as unknown as typeof import('react-native').ScrollView;

const Chip = styled.Pressable<{ $active?: boolean }>`
  padding: 6px 12px;
  height: 32px;
  border-radius: 10px;
  background: ${({ $active }) => ($active ? '#02F59B' : '#353637')};
  margin-right: 8px;
  align-items: center;
  justify-content: center;
`;

const ChipText = styled.Text<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? '#0f1011' : '#cfd4da')};
  font-size: 14px;
  line-height: 18px;
  font-family: 'PlusJakartaSans_600Light';
`;
