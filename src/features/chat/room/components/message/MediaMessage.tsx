import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface MediaMessageProps {
  type: 'IMAGE' | 'VIDEO';
  localUrl?: string;
  mediaUrl: string | null;
  thumbnailUrl?: string | null;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'failed';
  errorMessage?: string;
  onRetry?: () => void;
  maxWidth?: number;
}

const MediaMessage: React.FC<MediaMessageProps> = ({
  type,
  localUrl,
  mediaUrl,
  thumbnailUrl,
  uploadStatus = 'success',
  errorMessage,
  onRetry,
  maxWidth = 250,
}) => {
  // 표시할 URL 결정 (localUrl 우선)
  const displayUrl = localUrl || mediaUrl;

  if (!displayUrl) {
    return <ErrorText>미디어를 불러올 수 없습니다</ErrorText>;
  }

  // 미디어 렌더링 (공통)
  const renderMedia = () => {
    if (type === 'IMAGE') {
      return <MediaImage source={{ uri: displayUrl }} />;
    }

    return (
      <VideoContainer>
        <MediaVideo
          source={{ uri: displayUrl }}
          resizeMode={ResizeMode.COVER}
          shouldPlay={uploadStatus === 'success'}
          useNativeControls={uploadStatus === 'success'}
          usePoster={!!thumbnailUrl}
          posterSource={thumbnailUrl ? { uri: thumbnailUrl } : undefined}
          posterStyle={{ resizeMode: 'cover' }}
        />
      </VideoContainer>
    );
  };

  // 오버레이 렌더링
  const renderOverlay = () => {
    if (uploadStatus === 'uploading' || uploadStatus === 'pending') {
      return (
        <LoadingOverlay>
          <ActivityIndicator size="large" color={theme.colors.primary.mint} />
        </LoadingOverlay>
      );
    }

    if (uploadStatus === 'failed') {
      return (
        <ErrorOverlay>
          <TouchableOpacity onPress={onRetry}>
            <Icon type="alert" size={32} color={theme.colors.secondary.red} />
            <RetryText>Tap to retry</RetryText>
            {errorMessage && <ErrorDetailText>{errorMessage}</ErrorDetailText>}
          </TouchableOpacity>
        </ErrorOverlay>
      );
    }

    return null;
  };

  return (
    <MediaContainer maxWidth={maxWidth}>
      {renderMedia()}
      {renderOverlay()}
    </MediaContainer>
  );
};

export default MediaMessage;

// ============= Styled Components =============
const MediaContainer = styled.View<{ maxWidth: number }>`
  max-width: ${({ maxWidth }) => maxWidth}px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const MediaImage = styled(Image)`
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
`;

const VideoContainer = styled.View`
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
`;

const MediaVideo = styled(Video)`
  width: 100%;
  height: 100%;
  border-radius: 12px;
`;

const LoadingOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
  border-radius: 12px;
`;

const ErrorOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  border-radius: 12px;
`;

const RetryText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-family: PlusJakartaSans_500Medium;
  margin-top: 8px;
  text-align: center;
`;

const ErrorDetailText = styled.Text`
  color: ${theme.colors.secondary.red};
  font-size: 12px;
  font-family: PlusJakartaSans_400Regular;
  margin-top: 4px;
  text-align: center;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.secondary.red};
  font-size: 14px;
  font-family: PlusJakartaSans_400Regular;
`;
