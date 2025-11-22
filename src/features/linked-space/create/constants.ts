import { DefaultAvatar } from './types';

/**
 * 기본 아바타 목록
 */
export const DEFAULT_AVATARS: DefaultAvatar[] = [
  {
    source: require('@/assets/images/character1.png'),
    url: 'https://kr.object.ncloudstorage.com/foreigner-bucket/default/character_01.png',
  },
  {
    source: require('@/assets/images/character2.png'),
    url: 'https://kr.object.ncloudstorage.com/foreigner-bucket/default/character_02.png',
  },
  {
    source: require('@/assets/images/character3.png'),
    url: 'https://kr.object.ncloudstorage.com/foreigner-bucket/default/character_03.png',
  },
];

/**
 * 기본 아바타 인덱스로 URL 가져오기
 */
export const getDefaultAvatarUrl = (index: number): string => {
  if (index >= 0 && index < DEFAULT_AVATARS.length) {
    return DEFAULT_AVATARS[index].url;
  }
  return DEFAULT_AVATARS[0].url;
};

/**
 * 스페이스 이름 최대 길이
 */
export const SPACE_NAME_MAX_LENGTH = 20;

/**
 * 스페이스 설명 최대 길이
 */
export const SPACE_DESCRIPTION_MAX_LENGTH = 200;
