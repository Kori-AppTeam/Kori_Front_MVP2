import {
  AllowedCategory,
  AllowedClientCategory,
  BoardId,
  ClientSortParam,
  SortParam,
} from '@/src/features/community/types';

export const CLIENT_CATEGORY_NAME: Record<AllowedCategory, AllowedClientCategory> = {
  ALL: 'All',
  NEWS: 'News',
  TIP: 'Tip',
  QNA: 'Q&A',
  EVENT: 'Event',
  FREE_TALK: 'Free talk',
  ACTIVITY: 'Activity',
};

export const CATEGORY_TO_BOARD_ID: Record<AllowedCategory, BoardId> = {
  ALL: 1,
  NEWS: 2,
  TIP: 3,
  QNA: 4,
  EVENT: 5,
  FREE_TALK: 6,
  ACTIVITY: 7,
};

export const CLIENT_SORT_NAME: Record<SortParam, ClientSortParam> = {
  LATEST: 'New',
  POPULAR: 'Hot',
};
