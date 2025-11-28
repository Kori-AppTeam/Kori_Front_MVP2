import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

interface ErrorMessageProps {
  message?: string | undefined;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <ErrorMessageContainer>
      {message && message.length && (
        <>
          <Icon type="info" size={16} color={theme.colors.secondary.red} />
          <ErrorText>{message}</ErrorText>
        </>
      )}
    </ErrorMessageContainer>
  );
};

export default ErrorMessage;

const ErrorMessageContainer = styled.View`
  min-height: 20px;
  max-height: 20px;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.small.small_M)};
`;
