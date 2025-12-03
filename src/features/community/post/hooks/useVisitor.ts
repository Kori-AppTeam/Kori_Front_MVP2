import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useProfileModalStore } from '../../shared/store/useProfileModalStore';
import { getIsVisitor } from '../apis/visitor';

export default function useVisitor() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['isVisitorState'],
    queryFn: () => getIsVisitor(),
  });

  const { profileModalVisible, setProfileModalVisible } = useProfileModalStore();

  const handleBlockVisitor = useCallback(
    (onSuccess: () => void) => {
      if (isLoading) {
        return;
      }

      if (isError) {
        console.error('[write:check] error');
        Alert.alert('Error', 'Failed to check profile status. Please try again.');
        return;
      }

      if (data?.profileCompleted === false) {
        setProfileModalVisible(true);
        return;
      }

      onSuccess();
    },
    [data, isError, isLoading],
  );

  return {
    data,
    isLoading,
    isError,
    refetch,
    profileModalVisible,
    setProfileModalVisible,
    handleBlockVisitor,
  };
}
