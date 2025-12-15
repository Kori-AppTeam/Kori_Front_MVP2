import { useEffect, useState } from 'react';
import { useUserProfile } from '../../shared/hooks/useUserProfile';
import { fetchChatMembers } from '../api/members';
import type { ChatMember } from '../types';

interface UseChatMembersParams {
  roomId: string | number;
}

interface UseChatMembersReturn {
  // 멤버 목록 상태
  members: ChatMember[];
  isLoadingMembers: boolean;

  // 프로필 관련 (useUserProfile 위임)
  userProfile: ReturnType<typeof useUserProfile>;
}

/**
 * 채팅방 멤버 목록 관리 Hook
 * 프로필 관련 로직은 shared의 useUserProfile로 위임
 */
export const useChatMembers = ({ roomId }: UseChatMembersParams): UseChatMembersReturn => {
  // 멤버 목록 상태
  const [members, setMembers] = useState<ChatMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // 프로필 관련 로직은 shared의 useUserProfile 사용
  const userProfile = useUserProfile();

  // 멤버 목록 조회
  useEffect(() => {
    const loadMembers = async () => {
      try {
        setIsLoadingMembers(true);
        const data = await fetchChatMembers(roomId);
        setMembers(data);
      } catch (err) {
        console.error('멤버 가져오기 실패', err);
        // 에러는 조용히 처리 (필요시 Toast 추가 가능)
      } finally {
        setIsLoadingMembers(false);
      }
    };

    loadMembers();
  }, [roomId]);

  return {
    // 멤버 목록
    members,
    isLoadingMembers,

    // 프로필 관련 전체를 userProfile로 반환
    userProfile,
  };
};
