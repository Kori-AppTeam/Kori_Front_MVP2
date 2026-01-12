import Icon from '@/components/common/Icon';
import Feather from '@expo/vector-icons/Feather';
import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import React, { useRef } from 'react';
import { Modal, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { useMediaDownload } from '../../hooks/useMediaDownload';

interface MediaViewerProps {
  visible: boolean;
  type: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  thumbnailUrl?: string;
  onClose: () => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ visible, type, mediaUrl, thumbnailUrl, onClose }) => {
  const videoRef = useRef<Video>(null);
  const { downloadMedia, isDownloading } = useMediaDownload({ mediaUrl, type });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <BackgroundPressable onPress={onClose}>
        <Container>
          {/* 닫기 버튼 */}
          <CloseButton onPress={onClose}>
            <Icon type="cancel" size={32} color="#ffffff" />
          </CloseButton>

          {/* 다운로드 버튼 */}
          <DownloadButton onPress={downloadMedia} disabled={isDownloading}>
            <DownloadIconWrapper>
              <Feather name="download" size={24} color="#ffffff" />
            </DownloadIconWrapper>
          </DownloadButton>

          {/* 미디어 컨텐츠 */}
          <ContentWrapper
            onStartShouldSetResponder={() => true}
            onResponderRelease={(e) => {
              e.stopPropagation();
            }}
          >
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
        </Container>
      </BackgroundPressable>
    </Modal>
  );
};

export default MediaViewer;

// ============= Styled Components =============
const BackgroundPressable = styled.Pressable`
  flex: 1;
  background-color: #000000;
`;

const Container = styled.View`
  flex: 1;
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

const DownloadButton = styled.TouchableOpacity<{ disabled: boolean }>`
  position: absolute;
  bottom: 50px;
  left: 20px;
  z-index: 10;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const DownloadIconWrapper = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: rgba(255, 255, 255, 0.2);
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
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
