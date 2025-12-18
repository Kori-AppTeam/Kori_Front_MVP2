/** 채팅방 멤버 타입 */
export interface ChatMember {
  userId: number;
  firstName: string;
  lastName: string;
  userImageUrl: string;
  isHost: boolean;
}

/** 신고 사유 */
export type ReportReason = 'Spam' | 'Sexual Activity' | 'Violence' | 'Fraud' | 'Etc';

/** 신고 데이터 */
export interface ReportData {
  userId: number;
  reason?: ReportReason;
  details: string;
}

/** 채팅방 그룹 여부 응답 */
export interface ChatRoomGroupStatus {
  isGroup: boolean;
}

/** 채팅방 나가기 콜백 타입 */
export type LeaveChatCallback = () => void | Promise<void>;
