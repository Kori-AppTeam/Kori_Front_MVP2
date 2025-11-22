import Icon from '@/components/common/Icon';
import React from 'react';
import styled from 'styled-components/native';

/**
 * 체크박스 공용 컴포넌트
 * : 체크 여부에 따라 다른 아이콘을 표시합니다.
 * @param isChecked 체크 여부
 * @param onPress 클릭 핸들러
 */
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
