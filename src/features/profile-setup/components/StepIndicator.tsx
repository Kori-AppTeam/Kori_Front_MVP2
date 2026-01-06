import React from 'react';
import styled from 'styled-components/native';

const StepIndicator = ({ step }: { step: number }) => {
  return (
    <Background>
      <Progress step={step} />
    </Background>
  );
};

export default StepIndicator;

const Background = styled.View`
  position: relative;
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.gray.darkGray_1_5};
  border-radius: 40px;
`;

const Progress = styled.View<{ step: number }>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${({ step }) => (step / 4) * 100}%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.primary.mint};
  border-radius: 40px;
  transition: width 0.3s ease-in-out;
`;
