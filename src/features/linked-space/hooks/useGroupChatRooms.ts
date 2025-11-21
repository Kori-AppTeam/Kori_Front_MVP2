import { useCallback, useEffect, useState } from 'react';
import { fetchAllSpaces, fetchBuzzingSpaces } from '../api/groupChatRooms';
import { GroupChatRoom } from '../types';

export const useGroupChatRooms = () => {
  const [buzzingSpaces, setBuzzingSpaces] = useState<GroupChatRoom[]>([]);
  const [allSpaces, setAllSpaces] = useState<GroupChatRoom[]>([]);
  const [lastChatRoomId, setLastChatRoomId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const buzzingData = await fetchBuzzingSpaces();
        setBuzzingSpaces(buzzingData);
      } catch (err) {
        console.error('Buzzing Spaces 불러오기 실패:', err);
      }
    };
    fetchRooms();
  }, []);

  const loadMoreSpaces = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const moreData = await fetchAllSpaces(lastChatRoomId);

      if (moreData && moreData.length > 0) {
        setAllSpaces((prev) => [...prev, ...moreData]);
        setLastChatRoomId(moreData[moreData.length - 1].roomId);
        setHasMore(moreData.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('추가 데이터 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, lastChatRoomId]);

  return {
    buzzingSpaces,
    allSpaces,
    isLoading,
    loadMoreSpaces,
  };
};
