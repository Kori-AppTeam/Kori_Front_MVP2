import { SortParam } from '@/src/features/community/types/postsListType';
import React from 'react';
import styled from 'styled-components/native';

type Props = {
  value: SortParam;
  onChange: (sort: SortParam) => void;
};

export default function SortTabs({ value, onChange }: Props) {
  return (
    <Bar>
      <SortBy>Sort by</SortBy>
      <Tab $active={value === 'LATEST'} onPress={() => value != 'LATEST' && onChange('LATEST')}>
        <TabText $active={value === 'LATEST'}>New</TabText>
      </Tab>
      <Divider>❘</Divider>
      <Tab $active={value === 'POPULAR'} onPress={() => value != 'POPULAR' && onChange('POPULAR')}>
        <TabText $active={value === 'POPULAR'}>Hot</TabText>
      </Tab>
    </Bar>
  );
}

const Bar = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 4px 12px 0 12px;

  gap: 8px;
`;
const SortBy = styled.Text`
  color: #848687;
  font-size: 13px;
  font-family: 'PlusJakartaSans_Regular';
`;
const Tab = styled.Pressable<{ $active?: boolean }>``;
const TabText = styled.Text<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? '#E9E9E9' : '#848687')};
  font-size: 13px;
  font-family: 'PlusJakartaSans_Regular';
`;

const Divider = styled.Text`
  margin: 0 1px;
  color: gray;
`;
