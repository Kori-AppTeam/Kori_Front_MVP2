import { AllowedClientCategory } from '@/src/features/community/post/types';
import { ANONYMOUS_ALLOWED_CATEGORIES } from '@/src/features/community/shared/constants/constants';
import { CLIENT_CATEGORY_TO_BOARD_ID } from '@/src/features/community/shared/utils/categoryMapper';
import { getAxiosErrorCode } from '@/src/shared/utils/getAxiosErrorCode';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { COMMON_ERROR_MESSAGE, COMMUNITY_ERROR_MESSAGE } from '../../shared/constants/error';
import { ImageAsset, UseWriteFormProps } from '../types';
import { useCreatePostWithImages } from './useCreatePost';
import { useUpdatePostWithImages } from './useUpdatePost';

export function useWriteForm({
  isEdit = false,
  postId,
  initialCategory = 'Activity',
  initialContent = '',
  initialImages = [],
  initialAnonymous = false,
}: UseWriteFormProps) {
  const savingRef = useRef({ current: false });
  const initialImagesRef = useRef<string[]>(initialImages); // 초기 이미지 저장 (수정 모드용)
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<AllowedClientCategory>(initialCategory);
  const [body, setBody] = useState<string>(initialContent);
  const [anonymous, setAnonymous] = useState(initialAnonymous);
  const [isFocused, setIsFocused] = useState(false);

  // 카테고리로부터 boardId 계산
  const boardId = useMemo(() => CLIENT_CATEGORY_TO_BOARD_ID[category], [category]);

  const updateMutation = useUpdatePostWithImages();
  const createMutation = useCreatePostWithImages(boardId);

  const canSave = useMemo(() => body.trim().length > 0, [body]);
  const canToggleAnon = ANONYMOUS_ALLOWED_CATEGORIES.has(category);

  // 수정 모드일 때는 익명 토글 불가 (isAnonymous 변경을 지원하지 않음)
  const canToggleAnonInEdit = isEdit ? false : canToggleAnon;

  // 카테고리 변경 시 익명 설정 자동 해제
  useEffect(() => {
    if (!canToggleAnon && anonymous) {
      setAnonymous(false);
    }
  }, [canToggleAnon, category, anonymous]);

  const handleSave = async (images: ImageAsset[]) => {
    if (!canSave || savingRef.current.current || createMutation.isPending || updateMutation.isPending) return;

    savingRef.current.current = true;
    setSaving(true);
    const content = body.trim();

    try {
      if (isEdit && postId) {
        await updateMutation.mutateAsync({
          postId,
          content,
          images,
          initialImages: initialImagesRef.current,
        });
        Alert.alert('Saved', 'Post updated successfully.');
      } else {
        await createMutation.mutateAsync({
          content,
          isAnonymous: anonymous,
          images,
        });
        Alert.alert('Success', 'Post created successfully!');
      }

      router.back();
    } catch (e: any) {
      const errorCode = getAxiosErrorCode(e);
      const errorMessage =
        COMMUNITY_ERROR_MESSAGE[errorCode] ||
        COMMON_ERROR_MESSAGE[errorCode] ||
        (isEdit ? 'Failed to update post.' : 'Failed to create post.');

      Toast.show({ type: 'error', text1: errorMessage });
    } finally {
      savingRef.current.current = false;
      setSaving(false);
    }
  };

  const handleToggleAnonymous = () => {
    if (isEdit) {
      Alert.alert('Cannot change', 'Anonymous status cannot be changed when editing a post.');
      return;
    }
    if (!canToggleAnon) {
      Alert.alert('Anonymous not available', 'Only Free talk and Q&A support anonymous posts.');
      return;
    }
    setAnonymous(!anonymous);
  };

  return {
    category,
    setCategory,
    body,
    setBody,
    anonymous,
    canSave,
    canToggleAnon: canToggleAnonInEdit,
    saving,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isFocused,
    setIsFocused,
    boardId,
    handleSave,
    handleToggleAnonymous,
  };
}
