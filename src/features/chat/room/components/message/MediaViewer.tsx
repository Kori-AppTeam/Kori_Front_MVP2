import Icon from '@/components/common/Icon';
import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import React, { useRef } from 'react';
import { Modal, StatusBar } from 'react-native';
import styled from 'styled-components/native';

interface MediaViewerProps {
  visible: boolean;
  type: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  thumbnailUrl?: string;
  onClose: () => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ visible, type, mediaUrl, thumbnailUrl, onClose }) => {
  const videoRef = useRef<Video>(null);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Container>
        {/* 닫기 버튼 */}
        <CloseButton onPress={onClose}>
          <Icon type="cancel" size={32} color="#ffffff" />
        </CloseButton>

        {/* 미디어 컨텐츠 */}
        <ContentWrapper>
          {type === 'IMAGE' ? (
            <FullImage source={{ uri: mediaUrl }} contentFit="contain" />
          ) : (
            <FullVideo
              ref={videoRef}
              source={{ uri: mediaUrl }}
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls
              shouldPlay
              usePoster={!!thumbnailUrl}
              posterSource={thumbnailUrl ? { uri: thumbnailUrl } : undefined}
              posterStyle={{ resizeMode: 'contain' }}
            />
          )}
        </ContentWrapper>

        {/* 배경 터치 시 닫기 */}
        <BackgroundTouchable onPress={onClose} activeOpacity={1} />
      </Container>
    </Modal>
  );
};

export default MediaViewer;

// ============= Styled Components =============
const Container = styled.View`
  flex: 1;
  background-color: #000000;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  right: 20px;
  z-index: 10;
  padding: 8px;
`;

const ContentWrapper = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const FullImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const FullVideo = styled(Video)`
  width: 100%;
  height: 100%;
`;

const BackgroundTouchable = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
`;
