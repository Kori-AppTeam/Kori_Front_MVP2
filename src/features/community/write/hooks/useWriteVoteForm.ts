import { getAxiosErrorCode } from '@/src/shared/utils/getAxiosErrorCode';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { COMMON_ERROR_MESSAGE, COMMUNITY_ERROR_MESSAGE } from '../../shared/constants/error';
import { useUpdateVotePost } from './useUpdateVotePost';
import { useWriteVote } from './useWriteVote';

interface UseWriteVoteFormProps {
  postId?: number;
  isEdit?: boolean;
  initialTitle: string;
  initialDescription?: string;
  initialContent?: string;
  initialAnonymous: boolean;
  initialOptions: string[];
}

export const useWriteVoteForm = ({
  postId,
  isEdit = false,
  initialTitle = '',
  initialDescription = '',
  initialContent = '',
  initialAnonymous = false,
  initialOptions = ['', ''],
}: UseWriteVoteFormProps) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [description, setDescription] = useState<string>(initialDescription);
  const [body, setBody] = useState<string>(initialContent);
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [anonymous, setAnonymous] = useState(initialAnonymous);
  const [isFocused, setIsFocused] = useState(false);

  const createMutation = useWriteVote();
  const updateMutation = useUpdateVotePost();

  const savingRef = useRef({ current: false });
  const canSave = useMemo(() => {
    const hasTitle = title.trim().length > 0;
    const validOptions = options.filter((option) => option.trim().length > 0);
    const hasEnoughOptions = validOptions.length >= 2;

    return hasTitle && hasEnoughOptions;
  }, [title, options]);

  // 수정 모드일 때는 익명 토글 불가 (isAnonymous 변경을 지원하지 않음)
  // const canToggleAnonInEdit = isEdit ? false : true;

  const handleSave = async () => {
    if (!canSave || savingRef.current.current || createMutation.isPending || updateMutation.isPending) return;

    savingRef.current.current = true;
    const content = body.trim();

    try {
      if (isEdit && postId) {
        await updateMutation.mutateAsync({
          body: {
            id: postId,
            title,
            description,
            content,
            isAnonymous: anonymous,
          },
        });
        router.back();
        Toast.show({ type: 'success', text1: 'Post updated successfully!' });
        return;
      }

      await createMutation.mutateAsync({
        title,
        description,
        content,
        isAnonymous: anonymous,
        options,
      });
      router.back();
      Toast.show({ type: 'success', text1: 'Post created successfully!' });
    } catch (e: any) {
      const errorCode = getAxiosErrorCode(e);
      const errorMessage =
        COMMUNITY_ERROR_MESSAGE[errorCode] ||
        COMMON_ERROR_MESSAGE[errorCode] ||
        (isEdit ? 'Failed to update post.' : 'Failed to create post.');

      Toast.show({ type: 'error', text1: errorMessage });
    } finally {
      savingRef.current.current = false;
    }
  };

  const handleToggleAnonymous = () => {
    if (isEdit) {
      Alert.alert('Cannot change', 'Anonymous status cannot be changed when editing a post.');
      return;
    }
    setAnonymous((prev) => !prev);
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    body,
    setBody,
    options,
    setOptions,
    anonymous,
    setAnonymous,
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
    canSave,
    isFocused,
    setIsFocused,
    handleSave,
    handleToggleAnonymous,
  };
};
