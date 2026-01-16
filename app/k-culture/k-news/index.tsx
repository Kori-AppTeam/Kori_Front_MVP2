import KNewsList from '@/src/features/k-culture/components/KNewsList';
import React from 'react';
import styled from 'styled-components/native';

const Index = () => {
  return (
    <Container>
      <KNewsList />
    </Container>
  );
};

export default Index;

const Container = styled.View`
  flex: 1;
  background: #1d1e1f;
`;
