import { formatDate, formatTime } from '@/src/shared/utils/dateUtils';
import { useChatStore } from '../stores/useChatStore';
import { ChatMessage } from '../types/index';

export const displayMessageItem = (currentMessage: ChatMessage, index: number) => {
  const messages = useChatStore.getState().messages;
  // 메시지 순서: [0, 1, 2, ..., n] (0이 최신 메시지)

  /** 상단 메시지와 같은 사용자인지 확인
   * @return 이전 메시지와 같은 사용자 여부
   */
  const isSameUser =
    index < messages.length - 1 && messages[index + 1].senderFirstName === messages[index].senderFirstName;

  /** 시간 표시 여부 */
  const showTime =
    index === 0 ||
    (index < messages.length - 1 &&
      formatTime(messages[index + 1].sentAt) !== formatTime(messages[index].sentAt) &&
      isSameUser) ||
    !isSameUser;

  /** 날짜 표시 여부 */
  const showDate =
    index === messages.length - 1 ||
    (messages[index + 1] && formatDate(messages[index + 1].sentAt) !== formatDate(currentMessage.sentAt));

  return {
    showTime,
    showDate,
    isSameUser,
  };
};
