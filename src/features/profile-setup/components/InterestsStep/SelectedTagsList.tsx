import Tag from '@/src/shared/components/Tag';
import { textStyle } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

interface SelectedTagsListProps {
  selectedCount: number;
  maxCount: number;
  value: string[];
  onTagPress?: (tag: string) => void;
}

const SelectedTagsList = ({ selectedCount, maxCount, value, onTagPress }: SelectedTagsListProps) => {
  return (
    <Wrapper>
      <SelectedCountText hasValue={!!value.length}>{`${selectedCount} / ${maxCount} selected`}</SelectedCountText>
      <TagScrollWrapper>
        {value.map((tag) => (
          <TagContainer key={tag}>
            <Tag label={tag} selected={true} onPress={() => onTagPress && onTagPress(tag)} />
          </TagContainer>
        ))}
      </TagScrollWrapper>
    </Wrapper>
  );
};

export default SelectedTagsList;

const Wrapper = styled.View`
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 54px;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  background-color: ${({ theme }) => theme.colors.primary.black};
  padding-top: 4px;
`;

const TagScrollWrapper = styled.ScrollView.attrs(() => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
}))`
  display: flex;
  flex-direction: row;
`;

const TagContainer = styled.View`
  margin-right: 6px;
`;

const SelectedCountText = styled.Text<{ hasValue: boolean }>`
  width: 90px;
  color: ${({ theme, hasValue }) => (hasValue ? theme.colors.primary.mint : theme.colors.gray.gray_1)};
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
  margin-right: 10px;
`;
