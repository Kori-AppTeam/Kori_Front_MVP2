import Tap from '@/src/shared/components/Tap';
import React from 'react';
import styled from 'styled-components/native';

interface InterestsTapProps {
  tabs: string[];
  selectedTap: string;
  onSelectTap: (tap: string) => void;
}

const InterestsTap = ({ tabs, selectedTap, onSelectTap }: InterestsTapProps) => {
  return (
    <TapWrapper>
      {tabs.map((tap) => (
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
  margin-top: 8px;
  margin-bottom: 14px;
`;
