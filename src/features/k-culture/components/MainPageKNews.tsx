import { K_CULTURE_ROUTER } from '@/src/shared/constants/route';
import { textStyle, theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { ErrorContainer, ErrorText, RetryButton, RetryButtonText } from '../../community/shared/styles/styles';
import { useGetRecentKnews } from '../hooks/useGetRecentKnews';
import { EmptyListContainer, EmptyListText } from '../styles/styles';
import { NewsType } from '../types';
import KNewsItem from './KNewsItem';
import MoreButton from './MoreButton';
import NewsCategory from './NewsCategory';

const MainPageKNews = () => {
  const [selectedCategory, setSelectedCategory] = useState<NewsType>('K-POP');
  const { items, isError, refetch, isLoading } = useGetRecentKnews(selectedCategory);

  const handleCategoryPress = (category: NewsType) => {
    setSelectedCategory(category);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <LoadingContainer>
          <ActivityIndicator />
        </LoadingContainer>
      );
    }
    if (isError) {
      return (
        <ErrorContainer>
          <ErrorText>An error occurred.</ErrorText>
          <RetryButton onPress={() => refetch()}>
            <RetryButtonText>Try Again</RetryButtonText>
          </RetryButton>
        </ErrorContainer>
      );
    }
    if (items.length === 0) {
      return (
        <EmptyListContainerStyled>
          <EmptyListText>No news available.</EmptyListText>
        </EmptyListContainerStyled>
      );
    }

    return (
      <NewsList>
        {items.map((item) => (
          <KNewsItem key={item.contentId} data={item} />
        ))}
      </NewsList>
    );
  };

  return (
    <Container>
      <Title>K-News</Title>
      <NewsCategory value={selectedCategory} onPress={handleCategoryPress} />

      {renderContent()}

      <MoreButton buttonText="More News" onPress={() => router.push(K_CULTURE_ROUTER.K_NEWS)} />
    </Container>
  );
};

export default MainPageKNews;

const Container = styled.View`
  padding: 30px 0px;
  background-color: ${theme.colors.primary.black};
  align-items: center;
  gap: 24px;
`;
const Title = styled.Text`
  width: 100%;
  padding: 0 20px;
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.headline.H4_SB)};
`;

const NewsList = styled.View`
  padding: 0 20px;
  width: 100%;
  gap: 10px;
`;

const EmptyListContainerStyled = styled(EmptyListContainer)`
  padding: 50px 0;
`;

const LoadingContainer = styled.View`
  padding: 50px 0;
  justify-content: center;
  align-items: center;
`;
