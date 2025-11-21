import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

interface GroupChatListFooterProps {
  isLoading: boolean;
}

export const GroupChatListFooter = ({ isLoading }: GroupChatListFooterProps) => {
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
