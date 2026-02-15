import {
  AllowedCategory,
  AllowedClientCategory,
  BoardId,
  ClientSortParam,
  SortParam,
} from '@/src/features/community/post/types';
import { Dimensions } from 'react-native';

export const CLIENT_CATEGORY_NAME: Record<AllowedCategory, AllowedClientCategory> = {
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

export const CATEGORY_TO_BOARD_ID: Record<AllowedCategory, BoardId> = {
  ALL: 1,
  QUIZ: 2,
  VOTE: 3,
  NEWS: 4,
  TIP: 5,
  QNA: 6,
  EVENT: 7,
  FREE_TALK: 8,
  ACTIVITY: 9,
};

export const CLIENT_SORT_NAME: Record<SortParam, ClientSortParam> = {
  LATEST: 'New',
  POPULAR: 'Hot',
};

// 카테고리 목록 (All 포함)
export const CATS: AllowedCategory[] = ['ALL', 'QUIZ', 'VOTE', 'NEWS', 'TIP', 'QNA', 'EVENT', 'FREE_TALK', 'ACTIVITY'];

// Write 화면용 카테고리 목록 (All 제외)
export const WRITE_CATEGORIES: AllowedClientCategory[] = ['News', 'Tip', 'Q&A', 'Event', 'Free talk', 'Activity'];

// 익명 작성 가능한 카테고리
export const ANONYMOUS_ALLOWED_CATEGORIES = new Set<AllowedClientCategory>(['Free talk', 'Q&A']);

// 글 작성 가이드라인
export const guidelines = [
  'Profanity or abusive language targeting others',
  'Sexual content',
  'Sexualized insults or misogynistic expressions',
  'Racial or ethnic discriminatory expressions',
  'Violent or threatening content',
  'General hate speech or derogatory remarks',
  'Spam or promotional content',
];

export const ASPECT_RATIO = 200 / 335; // 게시글 이미지 비율 (높이 / 너비)
export const SCREEN_WIDTH = Math.round(Dimensions.get('window').width); // 화면 가로 길이
