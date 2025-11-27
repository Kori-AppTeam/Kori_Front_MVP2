import React from 'react';
import styled from 'styled-components/native';

interface LeaveChatButtonProps {
  onPress: () => void;
}

export const LeaveChatButton: React.FC<LeaveChatButtonProps> = ({ onPress }) => {
  return (
    <>
      <Button onPress={onPress}>
        <ButtonText>Leave Chat</ButtonText>
      </Button>
      <BottomSpacer />
    </>
  );
};

const Button = styled.TouchableOpacity`
  height: 50px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background-color: #ff4f4f;
  margin-bottom: 8px;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  font-family: 'PlusJakartaSans-Medium';
`;

const BottomSpacer = styled.View`
  height: 25px;
`;
