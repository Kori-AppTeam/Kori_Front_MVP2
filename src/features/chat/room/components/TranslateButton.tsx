import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { TranslateButtonProps } from '../types/chat-ui.types';

const { height } = Dimensions.get('window');

const TranslateButton: React.FC<TranslateButtonProps> = ({
  isTranslating,
  onToggle,
  position = 'fixed'
}) => {
  if (isTranslating) {
    return (
      <TranslatingButtonBox onPress={onToggle}>
        <TranslatingImage source={require('@/assets/images/translating.png')} />
      </TranslatingButtonBox>
    );
  }

  return (
    <TranslateButtonBox onPress={onToggle} position={position}>
      <TranslateImage source={require('@/assets/images/translate.png')} />
    </TranslateButtonBox>
  );
};

export default TranslateButton;

// ============= Constants =============
const TRANSLATE_BUTTON_CONFIG = {
  BOTTOM_RATIO: 0.12,
  SIZE: 50,
  BORDER_RADIUS: 30,
  Z_INDEX: 999,
  RIGHT_OFFSET: 10,
} as const;

const TRANSLATE_IMAGE_SIZE = {
  WIDTH: 75,
  HEIGHT: 75,
} as const;

const TRANSLATING_IMAGE_SIZE = {
  WIDTH: 130,
  HEIGHT: 130,
} as const;

// ============= Base Styled Components =============
const BaseButtonBox = styled.TouchableOpacity`
  position: absolute;
  width: ${TRANSLATE_BUTTON_CONFIG.SIZE}px;
  height: ${TRANSLATE_BUTTON_CONFIG.SIZE}px;
  border-radius: ${TRANSLATE_BUTTON_CONFIG.BORDER_RADIUS}px;
  z-index: ${TRANSLATE_BUTTON_CONFIG.Z_INDEX};
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const BaseImage = styled.Image`
  resize-mode: contain;
`;

// ============= Styled Components =============
const TranslateButtonBox = styled(BaseButtonBox) <{ position?: 'fixed' | 'center' }>`
  bottom: ${({ position }) =>
    position === 'fixed' ? height * TRANSLATE_BUTTON_CONFIG.BOTTOM_RATIO : 'auto'
  }px;
  right: ${({ position }) =>
    position === 'fixed' ? `${TRANSLATE_BUTTON_CONFIG.RIGHT_OFFSET}px` : 'auto'
  };
  align-self: ${({ position }) => position === 'center' ? 'center' : 'auto'};
`;

const TranslatingButtonBox = styled(BaseButtonBox)`
  align-self: center;
`;

const TranslateImage = styled(BaseImage)`
  width: ${TRANSLATE_IMAGE_SIZE.WIDTH}px;
  height: ${TRANSLATE_IMAGE_SIZE.HEIGHT}px;
`;

const TranslatingImage = styled(BaseImage)`
  width: ${TRANSLATING_IMAGE_SIZE.WIDTH}px;
  height: ${TRANSLATING_IMAGE_SIZE.HEIGHT}px;
`;