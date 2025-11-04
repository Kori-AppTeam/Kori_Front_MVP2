//채팅방 route 경로
export const CHAT_ROUTE = (roomId: number | string) => `/chat/${roomId}`;
export const CHAT_MEMBER_ROUTE = (roomId: number) => `/chat/${roomId}/members`;
export const CREATE_LINKED_SPACE_ROUTE = '/chat/create';
export const CREATE_LINKED_SPACE_DONE_ROUTE = '/chat/create/done';
export const LINKED_SPACE_DETAIL_ROUTE = (roomId: number) => `/chat/detail/${roomId}`;
export const CHAT_SEARCH_ROUTE = '/chat/search';