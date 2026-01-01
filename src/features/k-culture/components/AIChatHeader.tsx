import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import Toast from 'react-native-toast-message';
import styled from 'styled-components/native';

const AIChatHeader = () => {
  const handleClickAIChat = () => {
    Toast.show({
      type: 'info',
      text1: 'AI Chat is coming soon!',
    });
  };

  return (
    <Container>
      <BottomContainer>
        <TextBox>
          <Title>Korean AI chat</Title>
          <Subtitle>Do you want to learn Korean?</Subtitle>
        </TextBox>
        {/* AI 채팅 이동 */}
        <Button onPress={handleClickAIChat}>
          <ButtonText>Start Chat</ButtonText>
        </Button>
      </BottomContainer>
    </Container>
  );
};

export default AIChatHeader;

const Container = styled.View`
  width: 100%;
  position: absolute;
  bottom: 30px;
  z-index: 10;
`;
const BottomContainer = styled.View`
  align-items: center;
  gap: 20px;
`;
const TextBox = styled.View`
  gap: 4px;
  align-items: center;
`;
const Title = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.headline.H3_SB)};
  color: ${theme.colors.primary.white};
`;
const Subtitle = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B3_R)};
  color: ${theme.colors.primary.white};
`;
const Button = styled.Pressable`
  padding: 19.5px 35.5px;
  border-radius: 8px;
  background-color: ${theme.colors.primary.mint};
`;
const ButtonText = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
  color: ${theme.colors.primary.black};
`;
