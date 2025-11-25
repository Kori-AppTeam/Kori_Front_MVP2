import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message && message === '') return;

  return (
    <ErrorMessageContainer>
      <Icon type="info" size={16} color={theme.colors.secondary.red} />
      <ErrorText>{message}</ErrorText>
    </ErrorMessageContainer>
  );
};

export default ErrorMessage;

const ErrorMessageContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.small.small_M)};
`;
