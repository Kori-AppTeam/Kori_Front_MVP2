import React from 'react';
import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import styled from 'styled-components/native';

interface DropdownInputProps {
  label: string;
  value?: string;
  selectedCount?: number;
  maxCount?: number;
  isOpen: boolean;
  onPress: () => void;
}

const DropdownInput = ({ label, value, selectedCount, maxCount, isOpen, onPress }: DropdownInputProps) => {
  const hasValue = !!value || (selectedCount ?? 0) > 0;

  return (
    <>
      <DropdownInputContainer isOpen={isOpen} onPress={onPress}>
        <DropdownInputPlaceholder>{value || label}</DropdownInputPlaceholder>
        <Icon
          type={isOpen ? 'dropdownArrowUp' : 'dropdownArrowDown'}
          size={32}
          color={isOpen ? theme.colors.primary.mint : theme.colors.primary.white}
        />
      </DropdownInputContainer>
      {maxCount && (
        <DropdownSelectedCount
          hasValue={hasValue}
        >{`${selectedCount ?? 0} / ${maxCount} selected`}</DropdownSelectedCount>
      )}
    </>
  );
};

export default DropdownInput;

const DropdownInputContainer = styled.Pressable<{ isOpen: boolean }>`
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 12px 0 16px;
  background-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  border: 1px solid ${({ theme, isOpen }) => (isOpen ? theme.colors.primary.mint : theme.colors.gray.darkGray_2)};
  border-radius: 4px;
`;

const DropdownInputPlaceholder = styled.Text.attrs({
  numberOfLines: 1,
  ellipsizeMode: 'tail',
})`
  flex: 1;
  margin-right: 8px;
  ${({ theme }) => textStyle(theme.fonts.body.B2_R)};
  color: ${({ theme }) => theme.colors.primary.white};
`;

const DropdownSelectedCount = styled.Text<{ hasValue: boolean }>`
  flex: 1;
  width: 100%;
  text-align: right;
  color: ${({ theme, hasValue }) => (hasValue ? theme.colors.primary.mint : theme.colors.gray.gray_1)};
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
`;
