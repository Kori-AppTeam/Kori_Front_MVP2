import { getEmojiFor } from '@/src/lib/interests';
import React from 'react';
import styled from 'styled-components/native';

type InterestTagProps = {
  label: string;
  borderColor?: string;
  textColor?: string;
  backgroundColor?: string;
};

export default function InterestTag({ label, borderColor, textColor, backgroundColor }: InterestTagProps) {
  const emoji = getEmojiFor(label);
  const labelWithEmoji = emoji ? `${emoji} ${label}` : label;

  return (
    <TagContainer style={{ borderColor, backgroundColor }}>
      <TagText style={{ color: textColor }}>{labelWithEmoji}</TagText>
    </TagContainer>
  );
}

const TagContainer = styled.View`
  border-width: 1px;
  border-color: #d9d9d9;
  border-radius: 999px;
  padding: 5px 10px;
  margin: 0px;
`;

const TagText = styled.Text`
  font-size: 13px;
  font-family: 'PlusJakartaSans_600Regular';
`;
