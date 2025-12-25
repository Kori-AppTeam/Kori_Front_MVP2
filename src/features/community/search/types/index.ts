import { BoardId, PostsListItem, RequestPageParams } from '../../post/types';

export interface SearchedPostCursorPage {
  items: {
    item: PostsListItem;
    score: number;
  }[];
  hasNext: boolean;
  nextCursor?: string | null;
}

export interface SearchedPostServerResp {
  message: string;
  data: SearchedPostCursorPage;
  timestamp: string;
}

export interface SearchReqParams extends RequestPageParams {
  q: string;
  boardId: BoardId;
}
