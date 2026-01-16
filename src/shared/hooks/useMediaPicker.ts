import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { MEDIA_CONFIG, validateFileFormat, validateFileSize } from '../utils/mediaUtils';

interface MediaPickerResult {
  uri: string;
  type: 'IMAGE' | 'VIDEO';
  name: string;
  mimeType: string;
}

interface MediaPickerHook {
  pickMedia: () => Promise<MediaPickerResult | null>;
}

export const useMediaPicker = (): MediaPickerHook => {
  // 권한 요청
  const requestPermissions = async (): Promise<boolean> => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
      Alert.alert('Permission Required', 'Camera and gallery access are required to send photos and videos.');
      return false;
    }
    return true;
  };

  // 미디어 선택
  const pickMedia = async (): Promise<MediaPickerResult | null> => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    return new Promise((resolve) => {
      Alert.alert('Send Photo or Video', 'Choose a source', [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await openCamera();
            resolve(result);
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await openGallery();
            resolve(result);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(null),
        },
      ]);
    });
  };

  // 카메라
  const openCamera = async (): Promise<MediaPickerResult | null> => {
    try {
      const MediaTypeCompat = (ImagePicker as any).MediaType || (ImagePicker as any).MediaTypeOptions;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: MediaTypeCompat.All,
        allowsEditing: false,
        quality: 0.8,
      });

      if (result.canceled) return null;

      const asset = result.assets[0];
      const mediaType = asset.type === 'video' ? 'VIDEO' : 'IMAGE';

      return await validateAndReturnMedia(asset.uri, mediaType);
    } catch (error) {
      console.error('카메라 오류:', error);
      Alert.alert('Error', 'Failed to open camera');
      return null;
    }
  };

  // 갤러리
  const openGallery = async (): Promise<MediaPickerResult | null> => {
    try {
      const MediaTypeCompat = (ImagePicker as any).MediaType || (ImagePicker as any).MediaTypeOptions;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: MediaTypeCompat.All,
        allowsEditing: false,
        quality: 0.8,
      });

      if (result.canceled) return null;

      const asset = result.assets[0];
      const mediaType = asset.type === 'video' ? 'VIDEO' : 'IMAGE';

      return await validateAndReturnMedia(asset.uri, mediaType);
    } catch (error) {
      console.error('갤러리 오류:', error);
      Alert.alert('Error', 'Failed to open gallery');
      return null;
    }
  };

  // 미디어 검증
  const validateAndReturnMedia = async (uri: string, type: 'IMAGE' | 'VIDEO'): Promise<MediaPickerResult | null> => {
    // 형식 검증
    if (!validateFileFormat(uri, type)) {
      Alert.alert(
        'Invalid Format',
        `Only ${type === 'IMAGE' ? MEDIA_CONFIG.ALLOWED_IMAGE_FORMATS.join(', ') : MEDIA_CONFIG.ALLOWED_VIDEO_FORMATS.join(', ')} formats are allowed.`,
      );
      return null;
    }

    // 크기 검증
    const isValidSize = await validateFileSize(uri, type);
    if (!isValidSize) {
      const maxSize = type === 'IMAGE' ? MEDIA_CONFIG.MAX_IMAGE_SIZE : MEDIA_CONFIG.MAX_VIDEO_SIZE;
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      Alert.alert('File Too Large', `Maximum file size is ${maxSizeMB}MB.`);
      return null;
    }

    // 파일명 추출
    const fileName = uri.split('/').pop() || 'media';

    // MIME 타입 생성
    const ext = uri.split('.').pop()?.toLowerCase() || '';
    let mimeType = '';
    if (type === 'IMAGE') {
      mimeType = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg';
    } else {
      mimeType = ext === 'mov' ? 'video/quicktime' : 'video/mp4';
    }

    return {
      uri,
      type,
      name: fileName,
      mimeType,
    };
  };

  return {
    pickMedia,
  };
};
