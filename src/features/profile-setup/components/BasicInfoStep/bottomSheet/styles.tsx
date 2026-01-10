import { textStyle } from '@/src/styles/theme';
import styled from 'styled-components/native';

/*-- 바텀시트 공통 스타일 --*/

export const PickerBottomSheetContent = styled.View`
  background-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  width: 100%;
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
  padding: 20px;
`;

export const PickerBottomSheetHeader = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

export const PickerBottomSheetHandle = styled.View`
  width: 36px;
  height: 5px;
  background-color: ${({ theme }) => theme.colors.gray.gray_2};
  border-radius: 2px;
  margin-bottom: 24px;
`;

export const PickerListWrapper = styled.View<{ height: number }>`
  height: ${({ height }) => height * 0.5}px;
  padding-bottom: 20px;
`;

export const NoResultText = styled.Text`
  text-align: center;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.gray.gray_2};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
`;

export const CountryDropdownButton = styled.TouchableOpacity<{ selected?: boolean; error?: boolean }>`
  width: 100%;
  height: 50px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-width: 1px;
`;

export const CountryDropdownText = styled.Text<{ selected?: boolean }>`
  color: ${({ selected }) => (selected ? '#EDEDED' : '#949899')};
  font-size: 15px;
  font-family: 'PlusJakartaSans-Regular';
`;

export const PickerListItem = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 12px 14px;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
  background-color: ${({ selected, theme }) => (selected ? theme.colors.gray.darkGray_1_5 : 'transparent')};
  border-radius: ${({ selected }) => (selected ? 12 : 0)}px;
`;

export const PickerListText = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
`;
