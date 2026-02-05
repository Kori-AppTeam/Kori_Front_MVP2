import { AllowedCategory, AllowedClientCategory, BoardId } from '@/src/features/community/post/types';

// Client 카테고리 이름 -> Server 카테고리 코드 매핑
export const CLIENT_TO_SERVER_CATEGORY: Record<AllowedClientCategory, AllowedCategory> = {
  All: 'ALL',
  News: 'NEWS',
  Tip: 'TIP',
  'Q&A': 'QNA',
  Event: 'EVENT',
  'Free talk': 'FREE_TALK',
  Activity: 'ACTIVITY',
  Quiz: 'QUIZ',
  Vote: 'VOTE',
};

// Server 카테고리 코드 -> Client 카테고리 이름 매핑
export const SERVER_TO_CLIENT_CATEGORY: Record<AllowedCategory, AllowedClientCategory> = {
  ALL: 'All',
  NEWS: 'News',
  TIP: 'Tip',
  QNA: 'Q&A',
  EVENT: 'Event',
  FREE_TALK: 'Free talk',
  ACTIVITY: 'Activity',
  QUIZ: 'Quiz',
  VOTE: 'Vote',
};

// Client 카테고리 이름 -> BoardId 매핑
export const CLIENT_CATEGORY_TO_BOARD_ID: Record<AllowedClientCategory, BoardId> = {
  All: 1,
  Quiz: 2,
  Vote: 3,
  News: 4,
  Tip: 5,
  'Q&A': 6,
  Event: 7,
  'Free talk': 8,
  Activity: 9,
};

// 헬퍼 함수: Server 카테고리 -> Client 카테고리 변환
export function categoryToClient(serverCategory: AllowedCategory): AllowedClientCategory {
  return SERVER_TO_CLIENT_CATEGORY[serverCategory];
}

// 헬퍼 함수: Client 카테고리 -> Server 카테고리 변환
export function categoryToServer(clientCategory: AllowedClientCategory): AllowedCategory {
  return CLIENT_TO_SERVER_CATEGORY[clientCategory];
}
