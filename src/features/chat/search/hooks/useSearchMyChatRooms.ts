import { MyChatRoom } from '@/src/features/chat/list/types';
import { useEffect, useState } from 'react';
import { searchMyChatRooms } from '../api/searchChatRooms';
import { useDebounce } from './useDebounce';

/**
 * My Chat 검색 훅
 */
export const useSearchMyChatRooms = (searchText: string) => {
  const [chatRooms, setChatRooms] = useState<MyChatRoom[]>([]);
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
        const data = await searchMyChatRooms(debouncedSearchText);
        setChatRooms(data);
      } catch (err) {
        console.error('My Chat 검색 실패:', err);
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
