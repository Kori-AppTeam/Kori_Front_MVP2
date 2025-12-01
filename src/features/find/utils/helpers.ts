// src/features/find/utils/helpers.ts

import * as SecureStore from 'expo-secure-store';
import type { FollowingUser, FriendItem, RecommendedFriendDto } from '../types';

/**
 * DTO를 UI 아이템으로 변환 (현재는 1:1 매핑)
 */
export const toFriendItem = (dto: RecommendedFriendDto): FriendItem => {
  return {
    userId: dto.userId,
    firstname: dto.firstname,
    lastname: dto.lastname,
    gender: dto.gender,
    birthday: dto.birthday,
    country: dto.country,
    introduction: dto.introduction,
    purpose: dto.purpose,
    language: dto.language,
    hobby: dto.hobby,
    imageKey: dto.imageKey,
  };
};

/**
 * SecureStore에서 내 userId 가져오기
 */
export const getMyUserId = async (): Promise<number | undefined> => {
  try {
    const myUserIdStr = await SecureStore.getItemAsync('MyuserId');
    if (!myUserIdStr) return undefined;
    const id = Number(myUserIdStr);
    return Number.isFinite(id) ? id : undefined;
  } catch (error) {
    console.error('Failed to get MyuserId from SecureStore:', error);
    return undefined;
  }
};

/**
 * 팔로잉 목록에서 userId Set 생성
 */
export const extractFollowingIds = (accepted: FollowingUser[] | undefined): Set<number> => {
  return new Set((accepted ?? []).map((u) => Number(u?.id ?? u?.userId)).filter(Number.isFinite));
};
