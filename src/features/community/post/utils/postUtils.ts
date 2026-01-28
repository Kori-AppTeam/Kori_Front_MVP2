import { PostDetailType, PostsListItemType } from '../types';

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

export const hasValidImages = (images: string[] | string | null | undefined): boolean => {
  if (!images) return false;
  if (Array.isArray(images)) {
    return images.length > 0 && images.some((img) => img.trim() !== '');
  }
  return images.trim() !== '';
};
