import AIChatHeader from '@/src/features/k-culture/components/AIChatHeader';
import CharacterLoopCarousel from '@/src/features/k-culture/components/CharacterLoopCarousel';
import MainPageKNews from '@/src/features/k-culture/components/MainPageKNews';
import TrendingNews from '@/src/features/k-culture/components/TrendingNews';
import { textStyle, theme } from '@/src/styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import styled from 'styled-components/native';

export default function KcultureScreen() {
  return (
    <Container contentContainerStyle={{ gap: 10 }}>
      <HeaderContainer
        colors={[
          `${theme.colors.primary.mint}33`,
          `${theme.colors.secondary.blue}33`,
          `${theme.colors.primary.purple}33`,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <LinearGradient
          colors={[theme.colors.primary.black, 'rgba(29, 30, 31, 0.5)', 'rgba(29, 30, 31, 0)']}
          start={{ x: 0.5, y: 1.0 }}
          end={{ x: 0.5, y: 0.0 }}
          locations={[0, 0.5, 1]}
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            aspectRatio: 375 / 190,
            zIndex: 5,
          }}
        ></LinearGradient>
        <CharacterLoopCarousel />
        <AIChatHeader />
        <Header>
          <Title>K-culture</Title>
          <IconImage source={require('../../../assets/images/IsolationMode.png')} />
        </Header>
      </HeaderContainer>

      <TrendingNews title="Trending K-News" />

      {/* <QuizAndVote /> */}

      <MainPageKNews />
    </Container>
  );
}

const Container = styled.ScrollView`
  flex: 1;
  background: ${theme.colors.gray.darkBlack_1};
`;
const HeaderContainer = styled(LinearGradient)`
  width: 100%;
  /* 노치 문제 해결되면 사용 */
  /* aspect-ratio: ${375 / 440}; */
  aspect-ratio: ${375 / 389};
  position: relative;
  align-items: center;
  justify-content: center;
`;
const Header = styled.View`
  position: absolute;
  top: 12px;
  left: 0;
  right: 0;
  padding: 0 20px;
  flex-direction: row;
  align-items: center;
  z-index: 10;
`;
const Title = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.Serif.H3_R)};
`;
const IconImage = styled.Image`
  margin-left: 4px;
  width: 20px;
  height: 20px;
`;
