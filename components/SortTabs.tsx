import { SortParam } from '@/src/features/community/post/types';
import { textStyle } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

type Props = {
  value: SortParam;
  onPress: (sort: SortParam) => void;
};

export default function SortTabs({ value, onPress }: Props) {
  return (
    <Bar>
      <SortBy>Sort by</SortBy>
      <Tab $active={value === 'LATEST'} onPress={() => onPress('LATEST')}>
        <TabText $active={value === 'LATEST'}>New</TabText>
      </Tab>
      <Divider>❘</Divider>
      <Tab $active={value === 'POPULAR'} onPress={() => onPress('POPULAR')}>
        <TabText $active={value === 'POPULAR'}>Hot</TabText>
      </Tab>
    </Bar>
  );
}

const Bar = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 4px 12px 12px 12px;

  gap: 8px;
`;
const SortBy = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B5_R)}
  color: #848687;
  font-size: 13px;
`;
const Tab = styled.Pressable<{ $active?: boolean }>``;
const TabText = styled.Text<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? '#E9E9E9' : '#848687')};
  font-size: 13px;
  ${({ theme }) => textStyle(theme.fonts.body.B4_M)}
`;

const Divider = styled.Text`
  margin: 0 1px;
  color: gray;
`;
