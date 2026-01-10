import Tap from '@/src/shared/components/Tap';
import React from 'react';
import styled from 'styled-components/native';

const INTERESTS_TAP = ['K-Pop', 'K-Drama & Movie', 'Lifestyle'] as const;

interface InterestsTapProps {
  selectedTap: (typeof INTERESTS_TAP)[number];
  onSelectTap: (tap: (typeof INTERESTS_TAP)[number]) => void;
}

const InterestsTap = ({ selectedTap, onSelectTap }: InterestsTapProps) => {
  return (
    <TapWrapper>
      {INTERESTS_TAP.map((tap) => (
        <Tap key={tap} text={tap} selected={selectedTap === tap} onPress={() => onSelectTap(tap)} />
      ))}
    </TapWrapper>
  );
};

export default InterestsTap;

const TapWrapper = styled.View`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 44px;
  flex-direction: row;
  margin-bottom: 14px;
`;
