import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { IconBtn } from '../../features/community/shared/styles/styles';

type RecentSearchListProps = {
  data: string[];
  onPressKeyword: (text: string) => void; // 검색 실행
  onDeleteKeyword: (text: string) => void; // 단건 삭제
  onClearAll: () => void; // 전체 삭제
};

const RecentSearches = ({ data, onPressKeyword, onDeleteKeyword, onClearAll }: RecentSearchListProps) => {
  // 데이터 없으면 렌더링하지 않도록 처리
  if (!data || data.length === 0) return null;

  return (
    <Container>
      <HeaderRow>
        <SectionTitle>Recent Searches</SectionTitle>
        <ClearAllText onPress={onClearAll}>Delete All</ClearAllText>
      </HeaderRow>

      {data.map((item, index) => (
        <SearchedItem key={`${item}-${index}`} onPress={() => onPressKeyword(item)}>
          <SearchedItemText>{item}</SearchedItemText>
          <IconBtn onPress={() => onDeleteKeyword(item)}>
            <Icon type="cancelDark" size={16} color={theme.colors.gray.darkGray_1_5} />
          </IconBtn>
        </SearchedItem>
      ))}
    </Container>
  );
};

export default RecentSearches;

const Container = styled.View`
  margin-top: 10px;
  padding: 0 20px;
  margin-bottom: 24px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  color: ${theme.colors.gray.gray_1};
  ${({ theme }) => textStyle(theme.fonts.body.B5_SB)};
`;

const ClearAllText = styled.Text`
  color: ${theme.colors.secondary.red};
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
`;

const SearchedItem = styled.Pressable`
  padding: 14px 0;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const SearchedItemText = styled.Text`
  flex: 1;
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B4_L)};
`;
