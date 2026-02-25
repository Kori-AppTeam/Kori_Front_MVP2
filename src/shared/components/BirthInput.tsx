import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

type BirthInputProps = {
  value: string;
  onPress: () => void;
};

function BirthInput({ value, onPress }: BirthInputProps) {
  const isSet = value !== '';

  return (
    <TouchableOpacity onPress={onPress}>
      <BirthBox>
        <BirthText isSet={isSet} isText={value}>
          {value || 'MM/DD/YYYY'}
        </BirthText>
        {isSet ? <Icon type="check" size={24} color={theme.colors.primary.mint} /> : null}
      </BirthBox>
    </TouchableOpacity>
  );
}

export default BirthInput;

const BirthBox = styled.View`
  background-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  border-radius: 4px;
  width: 100%;
  height: 50px;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 0px 12px 0px 16px;
`;

const BirthText = styled.Text<{ isSet: boolean; isText: string }>`
  flex: 1;
  ${({ theme }) => theme.fonts.body.B2_R};
  color: ${({ isSet, theme }) => (!isSet ? theme.colors.gray.darkGray_2 : theme.colors.primary.white)};
`;
