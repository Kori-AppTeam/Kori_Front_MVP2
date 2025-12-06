import { formatDate, formatTime } from '@/src/shared/utils/dateUtils';
import { useChatStore } from '../stores/useChatStore';
import { ChatMessage } from '../types/index';

/** 메시지 Info 표시 로직 */
export const displayMessageItem = (currentMessage: ChatMessage, index: number) => {
  const messages = useChatStore.getState().messages;
  // 메시지 순서: [0, 1, 2, ..., n] (0이 최신 메시지)

  /** 상단 메시지와 같은 사용자인지 확인 */
  const isSameUserAbove =
    index < messages.length - 1 && messages[index + 1].senderFirstName === messages[index].senderFirstName;

  /** 하단 메시지와 같은 사용자인지 확인 */
  const isSameUserBelow = index > 0 && messages[index - 1].senderFirstName === messages[index].senderFirstName;

  /** 상단 메시지와 같은 시간인지 확인 */
  const isSameTimeAbove =
    index < messages.length - 1 && formatTime(messages[index + 1].sentAt) === formatTime(messages[index].sentAt);

  /** 하단 메시지와 같은 시간인지 확인 */
  const isSameTimeBelow = index > 0 && formatTime(messages[index - 1].sentAt) === formatTime(messages[index].sentAt);

  /** 시간 표시 여부 (메시지 연속성 고려) */
  const showTime =
    // 하단이 다른 사용자인 경우(최하단 메시지 포함)
    !isSameUserBelow ||
    // 하단이 같은 사용자이지만 시간이 연속되지 않는 경우
    (isSameUserBelow && !isSameTimeBelow) ||
    // 상단이 다른 사용자이고 하단의 시간이 연속되지 않을 때(최상단 메시지 포함)
    (!isSameUserAbove && !isSameTimeBelow);

  /** 프로필 표시 여부 */
  const showProfile =
    // 첫 메시지이거나
    index === messages.length - 1 ||
    // 상단 메시지와 다른 사용자이거나
    !isSameUserAbove ||
    // 같은 사용자이지만 시간이 연속되지 않는 경우
    (isSameUserAbove && !isSameTimeAbove);

  /** 날짜 표시 여부 */
  const showDate =
    index === messages.length - 1 ||
    (messages[index + 1] && formatDate(messages[index + 1].sentAt) !== formatDate(currentMessage.sentAt));

  return {
    showTime,
    showDate,
    showProfile,
    isSameUserAbove,
  };
};
