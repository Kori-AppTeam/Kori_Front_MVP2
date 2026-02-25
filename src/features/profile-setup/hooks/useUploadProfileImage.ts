import { uploadUserImage } from '@/src/features/profile-setup/api/profileImage';
import {
  requestPhotoPermissions,
  normalizePickedImage,
  pickImageFromDevice,
} from '@/src/features/profile-setup/lib/images';
import { getImagePickerMediaTypeCompat } from '@/src/features/profile-setup/utils/images';
import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';

export type UploadProfileImageResult = {
  uri: string;
  name: string;
  typeMime: 'image/jpeg' | 'image/png' | 'image/webp';
  imageKey: string;
};

type Params = {
  disabled?: boolean;
  onUploaded: (result: UploadProfileImageResult) => void;
};

/**
 * 프로필 이미지 업로드 Hook
 * - 권한 요청 → 디바이스에서 이미지 선택/촬영 → 업로드 → 콜백 전달
 */
export function useUploadProfileImage({ disabled, onUploaded }: Params) {
  const [uploading, setUploading] = useState(false);

  /* MediaType 호환 */
  const mediaTypeCompat = useMemo(getImagePickerMediaTypeCompat, []);

  /* 카메라/갤러리에서 이미지를 선택하고 서버에 업로드 */
  const pickAndUpload = useCallback(
    async (mode: 'camera' | 'gallery') => {
      const hasPermission = await requestPhotoPermissions();
      if (!hasPermission) return;

      const asset = await pickImageFromDevice({ mode, mediaTypeCompat });
      if (!asset) return;

      const { uri, fileName, uploadContentType, profileTypeMime } = normalizePickedImage(asset);

      setUploading(true);
      try {
        const imageKey = await uploadUserImage({ uri, fileName, contentType: uploadContentType });
        onUploaded({ uri, name: fileName, typeMime: profileTypeMime, imageKey });
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
        Alert.alert('Upload Failed', 'Image upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [mediaTypeCompat, onUploaded],
  );

  /* 카메라/갤러리 선택 Alert를 띄우고 선택된 모드로 pickAndUpload를 실행 */
  const onPress = useCallback(() => {
    if (disabled || uploading) return;

    Alert.alert(
      'Pick a Photo',
      'How would you like to set your profile picture?\n\nYour photo will be used in Friend Recommendations, Chatting, and Community features.',
      [
        { text: 'Camera', onPress: () => pickAndUpload('camera') },
        { text: 'Gallery', onPress: () => pickAndUpload('gallery') },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }, [disabled, pickAndUpload, uploading]);

  return {
    uploading,
    onPress,
    pickAndUpload,
  };
}
