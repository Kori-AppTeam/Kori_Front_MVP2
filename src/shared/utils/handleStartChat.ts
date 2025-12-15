import { useCreateOneToOneRoom } from '@/src/features/chat/room/hooks/useCreateOneToOneRoom';
import { CHAT_ROUTE } from '@/src/shared/constants/route';
import { router } from 'expo-router';

/**
 * 채팅방 생성 및 이동 핸들러
 * @param userId 대화 상대 사용자 ID
 * @param userName 대화 상대 사용자 이름(fullname)
 * @param closeProfile (선택 사항) 프로필 모달 닫기 함수
 */
export default async function handleStartChat(userId: number, userName: string, closeProfile?: () => void) {
  const { mutateAsync: createRoom } = useCreateOneToOneRoom();
  try {
    const roomId = await createRoom({ otherUserId: userId });
    router.push({
      pathname: CHAT_ROUTE(roomId),
      params: {
        roomName: userName,
      },
    });
    if (closeProfile) {
      closeProfile();
    }
  } catch (e) {
    throw e;
  }
}
