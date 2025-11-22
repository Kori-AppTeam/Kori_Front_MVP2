import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { createGroupSpace } from '../api/spaceApi';
import { getDefaultAvatarUrl } from '../constants';
import { CreateSpaceFormData } from '../types';
import { uploadCustomSpaceImage } from '../utils/imageUpload';

/**
 * 스페이스 생성 Mutation Hook
 */
export const useCreateSpace = () => {
  return useMutation({
    mutationFn: async (formData: CreateSpaceFormData) => {
      let finalImageUrl: string;

      // 커스텀 이미지인 경우 업로드
      if (formData.isCustomImage && formData.imageUri) {
        try {
          finalImageUrl = await uploadCustomSpaceImage(formData.imageUri);
        } catch (error) {
          throw new Error('Image upload failed');
        }
      } else {
        // 기본 아바타 사용
        finalImageUrl = getDefaultAvatarUrl(formData.avatarIndex);
      }

      // 스페이스 생성 API 호출
      const response = await createGroupSpace({
        roomName: formData.spaceName,
        description: formData.description,
        roomImageUrl: finalImageUrl,
      });

      return { ...response, finalImageUrl };
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: error.message === 'Image upload failed' ? 'Upload Fail' : 'Fail New Space Created',
      });
    },
  });
};
