import api from '@/api/axiosInstance';
import type { ChatRoomGroupStatus } from '../types';

/**
 * 채팅방 그룹 여부 확인
 * @param roomId 채팅방 ID
 * @returns 그룹 채팅 여부
 */
export const checkIsGroupChat = async (roomId: string | number): Promise<boolean> => {
  const response = await api.get<{ data: ChatRoomGroupStatus }>(`/api/v1/chat/isGroup?roomId=${roomId}`);
  return response.data.data.isGroup;
};

/**
 * 사용자 차단
 * @param userId 차단할 사용자 ID
 */
export const blockUser = async (userId: string | number): Promise<void> => {
  await api.post(`/api/v1/chat/block/${userId}`);
};

/**
 * 사용자 신고
 * TODO: API 엔드포인트 및 파라미터 확인 필요
 * @param userId 신고할 사용자 ID
 * @param details 신고 상세 내용
 */
export const reportUser = async (userId: number, details: string): Promise<void> => {
  // TODO: 실제 API 스펙 확인 필요
  // 현재 코드에서는 ignored 필드를 사용하고 userId를 보내지 않음
  // 백엔드 API 스펙 확인 후 수정 필요
  /*
  await api.post(`${Config.SERVER_URL}/api/v1/chat/declaration`, {
    userId,
    details,
    // or
    ignored: details,
  });
  */
  throw new Error('Report API endpoint needs to be confirmed');
};
