// 메시지 컨텍스트 메뉴 (길게 누르기 시 표시되는 팝업)
import { theme } from '@/src/styles/theme';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';

interface MessageMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  messageHeight: number;
  isMyMessage: boolean;
  content: string;
  onDelete?: () => void;
  onClose: () => void;
}

const MessageMenu: React.FC<MessageMenuProps> = ({
  visible,
  position,
  messageHeight,
  isMyMessage,
  content,
  onDelete,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(content);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    onClose();
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim]);

  if (!visible) return null;

  // 메뉴 위치 계산
  const menuY =
    position.y - (isMyMessage ? MENU_CONFIG.HEIGHT_WITH_DELETE : MENU_CONFIG.HEIGHT) - MENU_CONFIG.MARGIN_BOTTOM;
  const showBelow = menuY < MENU_CONFIG.SAFE_MARGIN_TOP;

  const finalY = showBelow ? position.y + messageHeight + MENU_CONFIG.MARGIN_TOP : menuY;

  const menuStyle = {
    top: finalY,
    right: isMyMessage ? MENU_CONFIG.RIGHT_MARGIN : undefined,
    left: isMyMessage ? undefined : position.x + MENU_CONFIG.LEFT_MARGIN,
    transform: [{ scale: scaleAnim }],
    opacity: opacityAnim,
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Overlay>
          <MenuContainer style={menuStyle}>
            <MenuItem onPress={handleCopy}>
              <MenuText>Copy</MenuText>
            </MenuItem>
            {isMyMessage && onDelete && (
              <>
                <MenuItem onPress={handleDelete}>
                  <DeleteText>Delete</DeleteText>
                </MenuItem>
              </>
            )}
          </MenuContainer>
        </Overlay>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default MessageMenu;

// ============= Constants =============
const MENU_CONFIG = {
  HEIGHT: 40, // 버튼 1개일 때
  HEIGHT_WITH_DELETE: 105, // 버튼 2개일 때
  WIDTH: 100,
  MARGIN_BOTTOM: 8,
  MARGIN_TOP: 8,
  LEFT_MARGIN: 50, // 좌측 정렬 마진
  RIGHT_MARGIN: 20, // 우측 정렬 마진
  SAFE_MARGIN_TOP: 50, // 상단 안전 영역
  BORDER_RADIUS: 12,
  ITEM_HEIGHT: 42,
} as const;

// ============= Styled Components =============
const Overlay = styled.View`
  flex: 1;
`;

const MenuContainer = styled(Animated.View)`
  position: absolute;
  width: ${MENU_CONFIG.WIDTH}px;
  background-color: ${theme.colors.primary.white};
  border-radius: ${MENU_CONFIG.BORDER_RADIUS}px;
`;

const MenuItem = styled.TouchableOpacity`
  height: ${MENU_CONFIG.ITEM_HEIGHT}px;
  justify-content: center;
  align-items: center;
`;

const MenuText = styled.Text`
  ${theme.fonts.body.B4_M};
  color: ${theme.colors.primary.black};
`;

const DeleteText = styled.Text`
  ${theme.fonts.body.B4_M};
  color: ${theme.colors.secondary.red};
`;
