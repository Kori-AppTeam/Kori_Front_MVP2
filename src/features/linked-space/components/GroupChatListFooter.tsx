import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

export const GroupChatListFooter = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;

  return (
    <FooterContainer>
      <ActivityIndicator size="small" color="#ffffff" />
    </FooterContainer>
  );
};

const FooterContainer = styled.View`
  padding: 20px;
  align-items: center;
`;
