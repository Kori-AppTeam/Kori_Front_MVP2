//채팅방 route 경로
import { NewsType } from '@/src/features/k-culture/types';
import { RelativePathString } from 'expo-router';

const toRoute = (path: string): RelativePathString => path as RelativePathString;

export const CHAT_ROUTE = (roomId: number | string) => toRoute(`/chat/${roomId}`);
export const CHAT_MEMBER_ROUTE = (roomId: number) => toRoute(`/chat/${roomId}/members`);
export const CREATE_LINKED_SPACE_ROUTE = toRoute('/chat/create');
export const CREATE_LINKED_SPACE_DONE_ROUTE = toRoute('/chat/create/done');
export const LINKED_SPACE_DETAIL_ROUTE = (roomId: number) => toRoute(`/chat/detail/${roomId}`);
export const CHAT_SEARCH_ROUTE = toRoute('/chat/search');

// 로그인, 회원가입 route 경로
export const AUTH_ROUTE = toRoute('/(auth)');
export const LOGIN_ROUTE = toRoute('/(auth)/login');
export const SIGNUP_ROUTE = toRoute('/(auth)/signup');
export const SIGNUP_DONE_ROUTE = toRoute('/(auth)/signup/done');
export const SIGNUP_TERMS_AND_CONDITIONS_ROUTE = toRoute('/(auth)/signup/terms-conditions');
export const SIGNUP_PRIVACY_POLICY_ROUTE = toRoute('/(auth)/signup/privacy-policy');
export const VERIFY_EMAIL_ROUTE = toRoute('/(auth)/login/verify/email');
export const VERIFY_PASSWORD_ROUTE = toRoute('/(auth)/login/verify/password');

// 커뮤니티 route 경로
export const COMMUNITY_ROUTER = {
  HOME: '/community',
  WRITE: '/community/write',
  MY_HISTORY: '/community/my-history',
  BOOKMARK: '/community/bookmark-list',
  DETAIL: (postId: number | string) => toRoute(`/community/detail/${postId}`),
  SEARCH: '/community/search',
} as const;

// 마이페이지 route 경로
export const MYPAGE_SUPPORT_ROUTE = toRoute('/mypage/support');

// k-culture route 경로
export const K_CULTURE_ROUTER = {
  HOME: '/k-culture',
  K_NEWS: '/k-culture/k-news',
  DETAIL: (newsId: number | string, type: NewsType, ago: number, fromSearch: boolean) =>
    toRoute(`/k-culture/detail/${newsId}?type=${type}&ago=${ago}&fromSearch=${fromSearch}`),
  SEARCH: '/k-culture/search',
} as const;
