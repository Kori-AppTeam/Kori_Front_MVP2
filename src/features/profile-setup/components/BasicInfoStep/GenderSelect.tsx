import styled from 'styled-components/native';

type Gender = 'Male' | 'Female' | 'Other';

type GenderSelectProps = {
  value?: Gender;
  onChange: (gender: Gender) => void;
};

const GenderSelect = ({ value, onChange }: GenderSelectProps) => {
  return (
    <SelectWrapper>
      <Select selected={value === 'Male'} onPress={() => onChange('Male')}>
        <Text selected={value === 'Male'}>Male</Text>
      </Select>
      <Select selected={value === 'Female'} onPress={() => onChange('Female')}>
        <Text selected={value === 'Female'}>Female</Text>
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
  border-width: ${({ selected }) => (selected ? 1 : 0)};
  border-color: ${({ theme }) => theme.colors.primary.mint};
  background-color: ${({ theme }) => theme.colors.gray.darkGray_1};
`;

const Text = styled.Text<{ selected: boolean }>`
  color: ${({ theme, selected }) => (selected ? theme.colors.primary.mint : theme.colors.primary.white)};
  ${({ theme }) => theme.fonts.body.B2_R};
`;
