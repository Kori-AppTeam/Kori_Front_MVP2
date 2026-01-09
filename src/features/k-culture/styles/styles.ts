import { textStyle, theme } from '@/src/styles/theme';
import styled from 'styled-components/native';

export const Description = styled.View`
  flex: 1;
  gap: 8px;
`;

export const NewsTitle = styled.Text`
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B4_M)};
`;

export const CategoryBadge = styled.Text`
  color: ${theme.colors.primary.mint};
  ${({ theme }) => textStyle(theme.fonts.small.small_M)};
`;

export const BottomRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
`;

export const Dot = styled.Text`
  color: ${theme.colors.gray.gray_2};
`;

export const DateText = styled.Text`
  color: ${theme.colors.gray.gray_2};
  ${({ theme }) => textStyle(theme.fonts.small.small_M)};
`;

export const EmptyListContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EmptyListText = styled.Text`
  color: ${theme.colors.gray.gray_2};
  ${({ theme }) => textStyle(theme.fonts.body.B2_M)};
  text-align: center;
`;
