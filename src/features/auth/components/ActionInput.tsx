import React from 'react';

import styled from 'styled-components/native';
import { theme } from '@/src/styles/theme';
import Icon from '@/components/common/Icon';
import CustomButton from '@/src/shared/components/CustomButton';
import Input, { InputProps } from '@/src/shared/components/Input';

interface ActionInputProps extends InputProps {
  isActionSuccess?: boolean;
  onActionPress?: () => void;
  actionLabelText: string;
  registerField?: string;
  actionDisabled?: boolean;
  isActionLoading?: boolean;
}

const ActionInput = ({ ...props }: ActionInputProps) => {
  return (
    <RowWrapper>
      <InputWrapper>
        <Input {...props} />
      </InputWrapper>
      {props.isActionSuccess ? (
        <ActionSuccessBtn>
          <Icon type="check" size={24} color={theme.colors.gray.gray_2} />
        </ActionSuccessBtn>
      ) : (
        <CustomButton
          label={props.actionLabelText}
          width={64}
          onPress={props.onActionPress}
          disabled={props.actionDisabled}
          isLoading={props.isActionLoading}
        />
      )}
    </RowWrapper>
  );
};

export default ActionInput;

const RowWrapper = styled.View`
  flex: 1;

  height: auto;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
`;

const InputWrapper = styled.View`
  flex: 1;
`;

const ActionSuccessBtn = styled.View`
  width: 64px;
  border-radius: 4px;
  height: 48px;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  border: ${({ theme }) => `1px solid ${theme.colors.gray.gray_2}`};
`;
