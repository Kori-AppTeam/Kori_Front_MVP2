import { textStyle } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

/*
- 탭 내비게이션을 구성하는 개별 탭 버튼 컴포넌트
- 활성/비활성 상태에 따른 스타일 적용 (색상, 하단 보더 표시)
*/

interface TabButtonProps {
  title: string;
  activeTab: boolean;
  onPress: () => void;
}

const TabButton = ({ title, activeTab, onPress }: TabButtonProps) => {
  return (
    <TabItem active={activeTab} onPress={onPress}>
      <TabBox active={activeTab}>
        <TabText active={activeTab}>{title}</TabText>
      </TabBox>
    </TabItem>
  );
};

export default TabButton;

// 탭 버튼들을 가로로 배치하는 Row
export const TabsRow = styled.View`
  flex-direction: row;
`;

// 탭 버튼 모음 하단에 위치하는 구분선
export const TabsBottomLine = styled.View`
  border-bottom-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  border-bottom-width: 1px;
`;

const TabItem = styled.Pressable<{ active: boolean }>`
  flex: 1;
  align-items: center;
`;

const TabBox = styled.View<{ active: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 15px 10px;
  min-width: 110px;
  border-bottom-width: 2px;
  border-bottom-color: ${({ theme, active }) => (active ? theme.colors.primary.mint : 'transparent')};
`;

const TabText = styled.Text<{ active: boolean }>`
  color: ${({ theme, active }) => (active ? theme.colors.primary.mint : theme.colors.gray.darkGray_2)};
  ${({ theme }) => textStyle(theme.fonts.body.B4_M)};
`;
