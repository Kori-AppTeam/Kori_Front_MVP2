import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

interface ValidationMessageProps {
  validated: boolean | undefined;
  message: string;
}

const ValidationMessage = ({ validated, message }: ValidationMessageProps) => {
  return (
    <ValidationMessageContainer>
      <Icon
        type={validated === false ? 'close' : 'check'}
        size={16}
        color={
          validated === undefined
            ? theme.colors.gray.gray_1
            : validated
              ? theme.colors.primary.mint
              : theme.colors.secondary.red
        }
      />
      <ValidationText $isnull={validated === undefined} $check={validated === true}>
        {message}
      </ValidationText>
    </ValidationMessageContainer>
  );
};

export default ValidationMessage;

const ValidationMessageContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const ValidationText = styled.Text<{ $isnull: boolean; $check: boolean }>`
  color: ${
    ({ $isnull, $check, theme }) =>
      $isnull
        ? theme.colors.gray.gray_1 // 입력 전: 회색
        : $check
          ? theme.colors.primary.white // 통과: 흰색
          : theme.colors.secondary.red // 실패: 빨강
  };
  ${({ theme }) => theme.fonts.body.B5_R};
`;
