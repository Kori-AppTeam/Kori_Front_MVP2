import { textStyle, theme } from '@/src/styles/theme';
import React, { memo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import { ErrorContainer, ErrorText, RetryButton, RetryButtonText } from '../../community/shared/styles/styles';
import { useGetTrendingNews } from '../hooks/useGetTrendingNews';
import { useScrollIndicator } from '../hooks/useScrollIndicator';
import { EmptyListContainer, EmptyListText } from '../styles/styles';
import TrendingNewsItem from './TrendingNewsItem';

type TrendingNewsProps = {
  title?: string;
};

const TrendingNews = ({ title }: TrendingNewsProps) => {
  const { items, isLoading, isError, refetch } = useGetTrendingNews();

  const INDICATOR_CONTAINER_WIDTH = 100;
  const INDICATOR_WIDTH = INDICATOR_CONTAINER_WIDTH / items.length;

  const { onScroll, indicatorStyle, contentWidth, layoutWidth } = useScrollIndicator(
    INDICATOR_CONTAINER_WIDTH,
    INDICATOR_WIDTH,
  );

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
        <EmptyListContainer>
          <EmptyListText>No trending news right now.</EmptyListText>
        </EmptyListContainer>
      );
    }

    return (
      <>
        <Animated.FlatList
          data={items}
          keyExtractor={(item) => item.contentId.toString()}
          renderItem={({ item, index }) => <TrendingNewsItem item={item} index={index} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          ItemSeparatorComponent={() => <View style={{ width: 8 }}></View>}
          onScroll={onScroll}
          scrollEventThrottle={16}
          // 전체 컨텐츠 크기가 바뀔 때마다 저장
          onContentSizeChange={(w) => {
            contentWidth.value = w;
          }}
          // 리스트의 화면상 크기가 결정될 때 저장
          onLayout={(e) => {
            layoutWidth.value = e.nativeEvent.layout.width;
          }}
        />
        <IndicatorWrapper>
          <Track width={INDICATOR_CONTAINER_WIDTH}>
            <AnimatedBar width={INDICATOR_WIDTH} style={indicatorStyle} />
          </Track>
        </IndicatorWrapper>
      </>
    );
  };

  return (
    <Container isTitle={!!title}>
      {title && <Title>{title}</Title>}
      {renderContent()}
    </Container>
  );
};

export default memo(TrendingNews);

const Container = styled.View<{ isTitle: boolean }>`
  width: 100%;
  padding: 30px 0;
  background-color: ${({ isTitle }) => (isTitle ? theme.colors.primary.black : 'transparent')};
`;

const Title = styled.Text`
  width: 100%;
  color: ${theme.colors.primary.white};
  padding: 0 20px;
  ${({ theme }) => textStyle(theme.fonts.headline.H4_SB)};
  margin-bottom: 23px;
`;

const IndicatorWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  width: 100%;
`;
const Track = styled.View<{ width: number }>`
  width: ${({ width }) => width}px;
  height: 3px;
  border-radius: 100px;
  background-color: ${theme.colors.gray.darkGray_1_5};
`;
const Bar = styled.View<{ width: number }>`
  width: ${({ width }) => width}px;
  height: 100%;
  border-radius: 100px;
  background-color: ${theme.colors.primary.mint};
`;
const AnimatedBar = Animated.createAnimatedComponent(Bar);

const LoadingContainer = styled.View`
  padding: 50px 0;
  justify-content: center;
  align-items: center;
`;
