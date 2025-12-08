import { Asset } from 'expo-asset';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image as RNImage } from 'react-native';
import { DEFAULT_AVATARS } from '../constants';

/**
 * 스페이스 이미지 선택 로직을 관리하는 Hook
 */
export const useSpaceImagePicker = () => {
  const [selectedAvatarIdx, setSelectedAvatarIdx] = useState<number>(0);
  const [customPhotoUri, setCustomPhotoUri] = useState<string | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [showAvatarSheet, setShowAvatarSheet] = useState(false);

  /**
   * 권한 요청
   */
  const requestPermissions = async (): Promise<boolean> => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const granted = cam.status === 'granted' && lib.status === 'granted';

    if (!granted) {
      Alert.alert(
        'Permission required',
        'Camera and photo library access is needed.\n\nYour photo will be used in Linked Space chatting room profile.',
      );
    }
    return granted;
  };

  /**
   * 카메라로 사진 촬영
   */
  const openCamera = async () => {
    const ok = await requestPermissions();
    if (!ok) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setCustomPhotoUri(result.assets[0].uri);
      setSelectedAvatarIdx(-1);
    }
  };

  /**
   * 갤러리에서 사진 선택
   */
  const openGallery = async () => {
    const ok = await requestPermissions();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setCustomPhotoUri(result.assets[0].uri);
      setSelectedAvatarIdx(-1);
    }
  };

  /**
   * 카메라/갤러리 선택 Alert
   */
  const pickFromCameraOrGallery = () => {
    Alert.alert(
      'Pick photo',
      'How to pick your profile photo?\n\nYour photo will be used in Linked Space chatting room profile.',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  /**
   * 아바타 선택 모달 열기
   */
  const openAvatarSheet = () => {
    if (avatarUrl) {
      const sources = DEFAULT_AVATARS.map((avatar) => avatar.source);
      const cur = sources.findIndex((img) => (RNImage.resolveAssetSource(img)?.uri ?? '') === avatarUrl);

      if (cur >= 0) {
        setSelectedAvatarIdx(cur);
        setCustomPhotoUri(undefined);
      } else {
        setSelectedAvatarIdx(-1);
        setCustomPhotoUri(avatarUrl);
      }
    } else {
      setSelectedAvatarIdx(0);
      setCustomPhotoUri(undefined);
    }
    setShowAvatarSheet(true);
  };

  /**
   * 아바타 저장
   */
  const saveAvatar = async () => {
    if (customPhotoUri) {
      setAvatarUrl(customPhotoUri);
    } else if (selectedAvatarIdx >= 0) {
      const asset = Asset.fromModule(DEFAULT_AVATARS[selectedAvatarIdx].source as number);
      await asset.downloadAsync();
      if (asset.localUri) setAvatarUrl(asset.localUri);
    }
    setShowAvatarSheet(false);
  };

  /**
   * 기본 아바타 선택
   */
  const selectDefaultAvatar = (index: number) => {
    setSelectedAvatarIdx(index);
    setCustomPhotoUri(undefined);
  };

  return {
    selectedAvatarIdx,
    customPhotoUri,
    avatarUrl,
    showAvatarSheet,
    openAvatarSheet,
    saveAvatar,
    pickFromCameraOrGallery,
    selectDefaultAvatar,
    closeAvatarSheet: () => setShowAvatarSheet(false),
  };
};
