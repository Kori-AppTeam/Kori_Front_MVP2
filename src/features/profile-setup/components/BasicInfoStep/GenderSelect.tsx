import { useState } from 'react';
import styled from 'styled-components/native';

type Gender = 'Male' | 'Female';

const GenderSelect = ({ gender }: { gender: Gender }) => {
  const [selectedGender, setSelectedGender] = useState<Gender>(gender); // TODO hook form으로 제어하도록 수정

  return (
    <SelectWrapper>
      <Select selected={selectedGender === 'Male'} onPress={() => setSelectedGender('Male')}>
        <Text selected={selectedGender === 'Male'}>Male</Text>
      </Select>
      <Select selected={selectedGender === 'Female'} onPress={() => setSelectedGender('Female')}>
        <Text selected={selectedGender === 'Female'}>Female</Text>
      </Select>
    </SelectWrapper>
  );
};

export default GenderSelect;

const SelectWrapper = styled.View`
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Select = styled.Pressable<{ selected: boolean }>`
  flex: 1;
  height: 48px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border-width: ${({ selected }) => (selected ? '1px' : 'none')};
  border-color: ${({ theme }) => theme.colors.primary.mint};
  background-color: ${({ theme }) => theme.colors.gray.darkGray_1};
`;

const Text = styled.Text<{ selected: boolean }>`
  color: ${({ theme, selected }) => (selected ? theme.colors.primary.mint : theme.colors.primary.white)};
  ${({ theme }) => theme.fonts.body.B2_R};
`;
