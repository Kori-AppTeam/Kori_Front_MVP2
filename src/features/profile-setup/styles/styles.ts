import { textStyle } from '@/src/styles/theme';
import styled from 'styled-components/native';

export const StepContainer = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
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

export const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary.black};
`;

export const Contents = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  margin: 12px 0 20px 0;
`;

export const Title = styled.Text`
  margin-top: 30px;
  ${({ theme }) => textStyle(theme.fonts.Serif.H1_R)};
  color: ${({ theme }) => theme.colors.primary.white};
`;

export const SubTitle = styled.Text`
  margin-top: 8px;
  margin-bottom: 40px;
  ${({ theme }) => textStyle(theme.fonts.body.B3_L)};
  color: ${({ theme }) => theme.colors.gray.gray_2};
`;
