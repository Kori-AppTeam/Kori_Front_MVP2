//채팅방 route 경로
import { RelativePathString } from 'expo-router';

const toRoute = (path: string): RelativePathString => path as RelativePathString;

export const CHAT_ROUTE = (roomId: number | string) => toRoute(`/chat/${roomId}`);
export const CHAT_MEMBER_ROUTE = (roomId: number) => toRoute(`/chat/${roomId}/members`);
export const CREATE_LINKED_SPACE_ROUTE = toRoute('/chat/create');
export const CREATE_LINKED_SPACE_DONE_ROUTE = toRoute('/chat/create/done');
export const LINKED_SPACE_DETAIL_ROUTE = (roomId: number) => toRoute(`/chat/detail/${roomId}`);
export const CHAT_SEARCH_ROUTE = toRoute('/chat/search');