import React from 'react';
import styled from 'styled-components/native';
import { MessageInputProps } from '../../types/chat-ui.types';

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  paddingBottom = 0,
}) => {
  const isSendEnabled = message.trim().length > 0;

  return (
    <InputContainer style={{ paddingBottom }}>
      <InputBox
        value={message}
        onChangeText={onMessageChange}
        placeholder="Enter a message"
        placeholderTextColor={INPUT_CONFIG.PLACEHOLDER_COLOR}
        multiline={false}
        returnKeyType="send"
        onSubmitEditing={onSendMessage}
      />
      <SendButton onPress={onSendMessage} disabled={!isSendEnabled}>
        <SendIcon
          tintColor={isSendEnabled ? INPUT_CONFIG.SEND_ACTIVE_COLOR : INPUT_CONFIG.SEND_INACTIVE_COLOR}
          source={require('@/assets/images/Send.png')}
        />
      </SendButton>
    </InputContainer>
  );
};

export default MessageInput;

// ============= Constants =============
const INPUT_CONFIG = {
  HEIGHT: 50,
  INPUT_HEIGHT: 40,
  INPUT_WIDTH_RATIO: 0.85,
  BUTTON_SIZE: 23,
  BUTTON_MARGIN: 20,
  BORDER_RADIUS: 8,
  PADDING_LEFT: 10,
  PADDING_TOP: 10,
  PLACEHOLDER_COLOR: '#888',
  SEND_ACTIVE_COLOR: '#02F59B',
  SEND_INACTIVE_COLOR: '#ffffff',
  BACKGROUND_COLOR: '#1d1e1f',
  INPUT_BACKGROUND_COLOR: '#353637',
  BORDER_COLOR: '#353637',
} as const;

// ============= Base Styled Components =============
const BaseContainer = styled.View`
  background-color: ${INPUT_CONFIG.BACKGROUND_COLOR};
  border-top-width: 1px;
  border-top-color: ${INPUT_CONFIG.BORDER_COLOR};
  flex-direction: row;
`;

const BaseButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

// ============= Styled Components =============
const InputContainer = styled(BaseContainer)`
  height: ${INPUT_CONFIG.HEIGHT}px;
`;

const InputBox = styled.TextInput`
  background-color: ${INPUT_CONFIG.INPUT_BACKGROUND_COLOR};
  color: #ffffff;
  border-radius: ${INPUT_CONFIG.BORDER_RADIUS}px;
  width: ${INPUT_CONFIG.INPUT_WIDTH_RATIO * 100}%;
  height: ${INPUT_CONFIG.INPUT_HEIGHT}px;
  margin-top: ${INPUT_CONFIG.PADDING_TOP}px;
  padding-left: ${INPUT_CONFIG.PADDING_LEFT}px;
  font-size: 14px;
  font-family: PlusJakartaSans_400Regular;
`;

const SendButton = styled(BaseButton) <{ disabled: boolean }>`
  width: ${INPUT_CONFIG.BUTTON_SIZE}px;
  height: ${INPUT_CONFIG.BUTTON_SIZE}px;
  margin: ${INPUT_CONFIG.BUTTON_MARGIN}px;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

const SendIcon = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
`;