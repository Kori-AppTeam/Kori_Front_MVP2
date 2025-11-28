// src/features/find/components/FindHeader.tsx

import React from 'react';
import styled from 'styled-components/native';

/**
 * Find Friends 화면 헤더
 */
export function FindHeader() {
  return (
    <Header>
      <Title>Find Friends</Title>
      <IconImage source={require('@/assets/images/IsolationMode.png')} />
    </Header>
  );
}

const Header = styled.View`
  padding: 12px 18px 8px 18px;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  color: #ffffff;
  font-size: 32px;
  font-family: 'InstrumentSerif_400Regular';
  letter-spacing: -0.2px;
`;

const IconImage = styled.Image`
  margin-left: 4px;
  width: 20px;
  height: 20px;
`;
