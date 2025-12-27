import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { IconBtn } from '../../shared/styles/styles';
import { useClearRecentSearchKeywords, useDeleteRecentSearchKeyword } from '../hooks/useRecentSearch';

type RecentSearchesProps = {
  data: string[];
  onSubmit: (text: string) => void;
};

const RecentSearches = ({ data, onSubmit }: RecentSearchesProps) => {
  const { mutate: deleteRecentSearchKeyword } = useDeleteRecentSearchKeyword();
  const { mutate: clearRecentSearchKeywords } = useClearRecentSearchKeywords();

  return (
    <Container>
      <HeaderRow>
        <SectionTitle>Recent Searches</SectionTitle>
        <ClearAllText onPress={() => clearRecentSearchKeywords()}>Clear All</ClearAllText>
      </HeaderRow>

      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <SearchedItem onPress={() => onSubmit(item)}>
            <SearchedItemText>{item}</SearchedItemText>
            <IconBtn onPress={() => deleteRecentSearchKeyword(item)}>
              <Icon type="cancel" size={16} color={theme.colors.gray.lightGray_2} />
            </IconBtn>
          </SearchedItem>
        )}
      />
    </Container>
  );
};

export default RecentSearches;

const Container = styled.View`
  flex: 1;
  margin-top: 10px;
  padding: 0 20px;
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
  padding: 10px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SearchedItemText = styled.Text`
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B4_L)};
`;
