import { LinkedSpace } from '@/src/features/linked-space/list/types';
import { useEffect, useState } from 'react';
import { searchGroupChatRooms } from '../api/searchChatRooms';
import { useDebounce } from './useDebounce';

/**
 * Linked Space 검색 훅
 */
export const useSearchGroupChatRooms = (searchText: string) => {
  const [chatRooms, setChatRooms] = useState<LinkedSpace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const debouncedSearchText = useDebounce(searchText, 300);

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!debouncedSearchText.trim()) {
        setChatRooms([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await searchGroupChatRooms(debouncedSearchText);
        setChatRooms(data);
      } catch (err) {
        console.error('Linked Space 검색 실패:', err);
        setError(err instanceof Error ? err : new Error('검색 실패'));
        setChatRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRooms();
  }, [debouncedSearchText]);

  return { chatRooms, isLoading, error };
};
