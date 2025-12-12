// src/features/find/hooks/useFindFriendsState.ts

import { useEffect, useState } from 'react';
import { getMyUserId } from '../utils/helpers';

/**
 * Find Friends 화면의 myId를 관리하는 Hook
 */
//TODO: 백엔드에서 myId 제외한 친구 목록을 제공하게 되면 이 Hook은 제거될 수 있습니다.
export function useFindFriendsState() {
  const [myId, setMyId] = useState<number | undefined>(undefined);

  // Load myId from SecureStore
  useEffect(() => {
    getMyUserId().then((id) => setMyId(id));
  }, []);

  return { myId };
}
