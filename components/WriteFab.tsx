import React from 'react';
import styled from 'styled-components/native';
import Icon from './common/Icon';

type Props = {
  onHandleWritePress: () => void;
  disabled?: boolean;
};

export default function WriteFab({ onHandleWritePress, disabled }: Props) {
  return (
    <Fab onPress={onHandleWritePress} disabled={disabled}>
      <Icon type="write" size={16} />
    </Fab>
  );
}

const Fab = styled.Pressable`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 54px;
  padding: 15px;
  height: 54px;
  border-radius: 100px;
  background: #02f59b;
  align-items: center;
  justify-content: center;
  shadow-color: rgba(0, 0, 0, 0.25);
  shadow-offset: 4px 4px;
  shadow-opacity: 1;
  shadow-radius: 8;
  elevation: 8;
`;
