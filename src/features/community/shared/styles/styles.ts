import { textStyle } from '@/src/styles/theme';
import styled from 'styled-components/native';

// 공통 모달 스타일들
export const BottomSheetContent = styled.View`
  flex: 1;
  padding: 10px 20px 40px 20px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  overflow: hidden;
`;

export const ButtonContainer = styled.Pressable`
  width: 100%;
  padding: 16px 0;
  flex-direction: row;
  gap: 8px;
  justify-content: start;
  align-items: center;
`;

export const ButtonText = styled.Text<{ color?: string }>`
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)}
  color: ${({ theme, color }) => (color ? color : theme.colors.gray.lightGray_1)}
`;

export const CategoryListContainer = styled.View`
  padding: 20px;
`;

export const ButtonWrap = styled.View`
  padding: 16px 12px 0 12px;
`;

export const CategoryItem = styled.Pressable`
  padding: 16px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const CategoryItemText = styled.Text<{ active?: boolean }>`
  color: ${({ theme, active }) => (active ? theme.colors.primary.white : theme.colors.gray.lightGray_1)};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
  flex: 1;
`;

export const Divider = styled.View`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray.darkGray_1};
`;

export const HandleWrap = styled.View`
  align-items: center;
`;

export const Handle = styled.View`
  width: 40px;
  height: 5px;
  background-color: #949899;
  border-radius: 2px;
`;

// 리스트 조회 에러 발생 시 공통 에러텍스트 스타일
export const ErrorContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.gray.gray_1};
  text-align: center;
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
`;

export const RetryButton = styled.Pressable`
  margin-top: 12px;
  padding: 8px 16px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.primary.mint};
`;

export const RetryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.black};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
`;

// 빈 리스트 공통 스타일
export const Empty = styled.View`
  padding: 40px 16px;
  align-items: center;
`;
export const EmptyText = styled.Text`
  color: #cfd4da;
  font-size: 14px;
`;
