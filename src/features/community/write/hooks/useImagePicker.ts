import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';
import { ImageAsset } from '../types';

export function useImagePicker() {
  const [images, setImages] = useState<ImageAsset[]>([]);

  const confirmPurposeAndPick = async () => {
    const proceed = await new Promise<boolean>((resolve) => {
      Alert.alert('Pick photo', 'The selected photos will be used only to attach to your post. Continue?', [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Continue', onPress: () => resolve(true) },
      ]);
    });
    if (!proceed) return;

    const { status, granted, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      if (!canAskAgain)
        Alert.alert('Permission Required', 'Please allow Photos access in Settings > [App Name] > Photos.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 5 - images.length,
    });

    if (!res.canceled) {
      // 새 이미지에서 mimeType과 name도 함께 저장하도록 수정
      const newImages = res.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.mimeType ?? 'image/jpeg',
        name: asset.fileName ?? `IMG_${Date.now()}.jpg`,
      }));

      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (uri: string) => {
    setImages((prev) => prev.filter((u) => u.uri !== uri));
  };

  const clearImages = () => {
    setImages([]);
  };

  return {
    images,
    setImages,
    pickImage: confirmPurposeAndPick,
    removeImage,
    clearImages,
  };
}
