import Icon from '@/components/common/Icon';
import { useMediaPicker } from '@/src/shared/hooks/useMediaPicker';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import { useChatStore } from '../../stores/useChatStore';
import { MessageInputProps } from '../../types';

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { currentMessage, setCurrentMessage } = useChatStore();
  const { pickMedia } = useMediaPicker();
  const { uploadMedia } = useMediaUpload();
  const isSendEnabled = currentMessage.trim().length > 0;

  // 사진/동영상 선택 핸들러
  const handlePhotoPress = async () => {
    const result = await pickMedia();
    if (result && roomId) {
      await uploadMedia(roomId, result.type, result.uri);
    }
  };

  return (
    <InputContainer>
      <IconWrapper onPress={handlePhotoPress}>
        <Icon type="photo" size={32} />
      </IconWrapper>
      <InputBox
        value={currentMessage}
        onChangeText={setCurrentMessage}
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
  align-items: center;
  padding: 15px 12px 0 12px;
  margin-bottom: 10px;
`;

// ============= Styled Components =============
const InputContainer = styled(BaseContainer)`
  height: ${INPUT_CONFIG.HEIGHT}px;
`;

const IconWrapper = styled.TouchableOpacity`
  margin-right: 8px;
`;

const InputBox = styled.TextInput`
  flex: 1;
  background-color: ${INPUT_CONFIG.INPUT_BACKGROUND_COLOR};
  color: #ffffff;
  border-radius: ${INPUT_CONFIG.BORDER_RADIUS}px;
  height: ${INPUT_CONFIG.INPUT_HEIGHT}px;
  padding: 0 ${INPUT_CONFIG.PADDING_LEFT}px;
  font-size: 14px;
  font-family: PlusJakartaSans_400Regular;
`;

const SendButton = styled.TouchableOpacity<{ disabled: boolean }>`
  width: ${INPUT_CONFIG.BUTTON_SIZE}px;
  height: ${INPUT_CONFIG.BUTTON_SIZE}px;
  margin-left: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const SendIcon = styled.Image`
  width: 100%;
  height: 100%;
`;
