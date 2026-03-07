import React from 'react';
import styled from 'styled-components/native';

// 온라인 상태를 표시하는 컴포넌트
interface OnlineStateProps {
  isOnline: boolean;
  size: number;
}

const OnlineState = ({ isOnline, size }: OnlineStateProps) => {
  return <Container isOnline={isOnline} size={size} />;
};

export default OnlineState;

const Container = styled.View<{ isOnline: boolean; size: number }>`
  border-radius: 50px;
  background-color: ${({ isOnline, theme }) => (isOnline ? theme.colors.primary.mint : theme.colors.gray.darkGray_2)};
  border-width: 3px;
  border-color: ${({ theme }) => theme.colors.primary.black};
  justify-content: center;
  align-items: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;
