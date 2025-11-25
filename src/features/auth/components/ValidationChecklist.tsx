import ValidationMessage from '@/src/features/auth/components/ValidationMessage';
import React from 'react';
import styled from 'styled-components/native';

// TODO 실제 유효성 검사 로직에 따라 validated 값 변경
const ValidationChecklist = () => {
  return (
    <ValidationChecklistContainer>
      <ValidationMessage validated={true} message="Use all case letters" />
      <ValidationMessage validated={false} message="Enter 8-12 letters" />
      <ValidationMessage validated={undefined} message="Enter special letters (@/!/~)" />
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
