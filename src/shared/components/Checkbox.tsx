import Icon from '@/components/common/Icon';
import React from 'react';
import styled from 'styled-components/native';

export interface CheckboxProps {
  isChecked: boolean;
  onPress: () => void;
}

const Checkbox = ({ isChecked, onPress }: CheckboxProps) => {
  return (
    <Container onPress={() => onPress()}>
      <Icon type={isChecked ? 'checkMintBox' : 'box'} size={20} />
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
`;

export default Checkbox;
