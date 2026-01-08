import { textStyle } from '@/src/styles/theme';
import styled from 'styled-components/native';

export const StepContainer = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-bottom: 40px;
`;

export const Field = styled.View`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FieldLabel = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B5_SB)};
  color: ${({ theme }) => theme.colors.primary.white};
`;
