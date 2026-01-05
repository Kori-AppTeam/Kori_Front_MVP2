import { useEffect, useState } from 'react';
import { fetchChatMembers } from '../api/members';
import type { ChatMember } from '../types';

interface UseChatMembersParams {
  roomId: string | number;
}

interface UseChatMembersReturn {
  // 멤버 목록 상태
  members: ChatMember[];
}

/**
 * 채팅방 멤버 목록 관리 Hook
 * 프로필 관련 로직은 shared의 useUserProfile로 위임
 */
export const useChatMembers = ({ roomId }: UseChatMembersParams): UseChatMembersReturn => {
  // 멤버 목록 상태
  const [members, setMembers] = useState<ChatMember[]>([]);

  // 멤버 목록 조회
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await fetchChatMembers(roomId);
        setMembers(data);
      } catch (err) {
        console.error('멤버 가져오기 실패', err);
      }
    };

    loadMembers();
  }, [roomId]);

  return {
    // 멤버 목록
    members,
  };
};
