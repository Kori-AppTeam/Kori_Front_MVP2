import { PostDetailType, PostPollDetail, PostsListItemType } from '../types';

// 게시글 미디어 타입(일반, 퀴즈/투표) 결정 함수
export const getMediaType = (boardCategory: string): 'GENERAL' | 'QUIZ' | 'VOTE' => {
  if (boardCategory === 'QUIZ') return 'QUIZ';
  if (boardCategory === 'VOTE') return 'VOTE';
  return 'GENERAL';
};

// 게시글 미디어 정보 파싱 함수
export const parsePostMediaInfo = (data: PostDetailType | PostsListItemType) => {
  const MediaType = getMediaType(data.boardCategory);

  // pollInfo, postInfo 분기 처리
  const pollInfo = 'pollInfo' in data ? data.pollInfo : undefined;
  const postInfo = 'postInfo' in data ? data.postInfo : undefined;

  return { MediaType, pollInfo, postInfo };
};

// 이미지 유효성 검사 함수
export const hasValidImages = (images: string[] | string | null | undefined): boolean => {
  if (!images) return false;
  if (Array.isArray(images)) {
    return images.length > 0 && images.some((img) => img.trim() !== '');
  }
  return images.trim() !== '';
};

// 타입 가드: PostDetailType이 PostPollDetail인지 확인
export const isPostType = (data: PostDetailType): data is PostPollDetail => {
  return 'pollInfo' in data && data.pollInfo !== null;
};
