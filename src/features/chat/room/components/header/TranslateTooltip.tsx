// 번역 확인 툴팁 컴포넌트
import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';

interface TranslateTooltipProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const TranslateTooltip: React.FC<TranslateTooltipProps> = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <Overlay>
          <TouchableWithoutFeedback>
            <TooltipContainer>
              <TooltipBackground colors={['#02F59B', '#44C6E9', '#9E70FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <DarkOverlay>
                  <Icon type="translateOn" size={24} />
                  <TooltipContent>
                    <TooltipText>Would you like to translate</TooltipText>
                    <TooltipText>the entire current chat page?</TooltipText>
                  </TooltipContent>

                  <TouchableOpacity onPress={onConfirm} activeOpacity={0.8}>
                    <OkButton colors={['#02F59B', '#44C6E9', '#9E70FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                      <OkButtonText>OK</OkButtonText>
                    </OkButton>
                  </TouchableOpacity>
                </DarkOverlay>
              </TooltipBackground>
              {/* <Arrow /> */}
            </TooltipContainer>
          </TouchableWithoutFeedback>
        </Overlay>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TranslateTooltip;

// ============= Styled Components =============
const Overlay = styled.View`
  padding: 70px 40px;
  background-color: rgba(0, 0, 0, 0.4);
  flex: 1;
`;

const TooltipContainer = styled.View`
  position: relative;
`;

const TooltipBackground = styled(LinearGradient)`
  border-radius: 12px;
`;

const DarkOverlay = styled.View`
  background-color: rgba(23, 24, 24, 0.7);
  border-radius: 10px;
  padding: 16px 20px;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const TooltipContent = styled.View`
  flex: 1;
`;

const TooltipText = styled.Text`
  color: ${theme.colors.primary.white};
  ${theme.fonts.body.B4_M};
`;

const OkButton = styled(LinearGradient)`
  width: 65px;
  height: 45px;
  padding: 10px 20px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

const OkButtonText = styled.Text`
  color: ${theme.colors.primary.black};
  ${theme.fonts.body.B4_M};
`;

const Arrow = styled.View`
  position: absolute;
  top: -8px;
  right: 47px;
  width: 0;
  height: 0;
  border-left-width: 8px;
  border-right-width: 8px;
  border-bottom-width: 8px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: #02f59b;
`;
