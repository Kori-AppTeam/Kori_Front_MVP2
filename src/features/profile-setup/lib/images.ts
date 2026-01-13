import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { coerceProfileMimeType, inferFileName, inferMimeType } from '@/src/features/profile-setup/utils/images';

/**
 * 카메라/갤러리 권한 요청
 * - 둘 중 하나라도 거부되면 안내 Alert를 띄우고 false를 반환
 */
export async function requestPhotoPermissions(): Promise<boolean> {
  const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Camera and gallery access are required.\n\nYour photo will be used in Friend Recommendations, Chatting, and Community features.',
    );
    return false;
  }

  return true;
}

/**
 * 디바이스에서 이미지 선택/촬영
 */
export async function pickImageFromDevice(params: {
  mode: 'camera' | 'gallery';
  mediaTypeCompat: any;
}): Promise<ImagePicker.ImagePickerAsset | null> {
  const pickerCall = params.mode === 'camera' ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;

  const result = await pickerCall({
    mediaTypes: params.mediaTypeCompat.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (result.canceled) return null;
  return result.assets[0] ?? null;
}

/**
 * 선택된 이미지 asset에서 업로드에 필요한 메타데이터(파일명/Content-Type 등)를 정규화
 * - 업로드에는 가능한 mimeType을 그대로 사용
 * - 앱 프로필 저장용 typeMime은 ProfilePhoto union에 맞게 보정
 */
export function normalizePickedImage(asset: ImagePicker.ImagePickerAsset): {
  uri: string;
  fileName: string;
  uploadContentType: string;
  profileTypeMime: 'image/jpeg' | 'image/png' | 'image/webp';
} {
  const uri = asset.uri;
  const fallbackMime = asset.type === 'video' ? 'application/octet-stream' : 'image/jpeg';
  const uploadContentType: string = (asset as any).mimeType || inferMimeType(uri, fallbackMime);
  const fileName = (asset as any).fileName || inferFileName(uri, 'UserProfilePhoto.jpg');
  const profileTypeMime = coerceProfileMimeType(uploadContentType);

  return { uri, fileName, uploadContentType, profileTypeMime };
}
