import React from 'react';
import styled from 'styled-components/native';
import { useFormContext } from 'react-hook-form';

import ValidationMessage from '@/src/features/auth/components/ValidationMessage';
import { PASSWORD_VALIDATIONS } from '@/src/features/auth/constants/validation';
import { SignUpFormValues } from '@/src/features/auth/types';

const ValidationChecklist = () => {
  const { watch } = useFormContext<SignUpFormValues>();
  const passwordValue = watch('password');

  return (
    <ValidationChecklistContainer>
      {PASSWORD_VALIDATIONS.map((validation, index) => {
        const validated = passwordValue ? validation.test(passwordValue) : passwordValue ? false : undefined;
        return <ValidationMessage key={index} message={validation.message} validated={validated} />;
      })}
    </ValidationChecklistContainer>
  );
};

export default ValidationChecklist;

const ValidationChecklistContainer = styled.View`
  width: 100%;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;
