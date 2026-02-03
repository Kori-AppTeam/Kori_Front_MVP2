import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import { Alert } from 'react-native';

interface UseMediaDownloadOptions {
  mediaUrl: string;
  type: 'IMAGE' | 'VIDEO';
}

export const useMediaDownload = ({ mediaUrl, type }: UseMediaDownloadOptions) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadMedia = async () => {
    try {
      setIsDownloading(true);

      // 권한 요청
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant media library access to save.');
        return;
      }

      // 파일 확장자 추출
      const extension = mediaUrl.split('.').pop()?.split('?')[0] || (type === 'IMAGE' ? 'jpg' : 'mp4');
      const fileName = `Kori_${Date.now()}.${extension}`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      // 파일 다운로드
      const downloadResult = await FileSystem.downloadAsync(mediaUrl, fileUri);

      // 갤러리에 저장
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);

      // 앨범에 추가 (선택사항)
      await MediaLibrary.createAlbumAsync('Kori', asset, false);

      Alert.alert('Download Complete', 'Saved to gallery!');
    } catch (error) {
      console.error('다운로드 실패:', error);
      Alert.alert('Download Failed', 'Failed to save media.');
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadMedia, isDownloading };
};
