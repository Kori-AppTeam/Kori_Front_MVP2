import api from '@/api/axiosInstance';
import type { Category } from '@/components/CategoryChips';
import { BoardId, PostDetail } from '@/src/features/community/types/postsListType';

export function categoryToBoardId(category: string): BoardId {
  switch (category) {
    case 'All':
      return 1;
    case 'News':
      return 2;
    case 'Tip':
      return 3;
    case 'Q&A':
      return 4;
    case 'Event':
      return 5;
    case 'Free talk':
      return 6;
    case 'Activity':
      return 7;
    default:
      return 1;
  }
}

export function categoryIdToCategory(id: number): Category {
  switch (id) {
    case 10:
      return 'News';
    case 11:
      return 'Free talk';
    case 12:
      return 'Q&A';
    case 13:
      return 'Tip';
    case 14:
      return 'Event';
    case 15:
      return 'Activity';
    default:
      return 'Free talk';
  }
}

export function pickDisplayName(row: any): string | undefined {
  const isAnon = row?.isAnonymous ?? row?.anonymous ?? false;

  const candidates = [
    row?.authorName,
    row?.memberName,
    row?.nickname,
    row?.userName,
    row?.writerName,
    row?.displayName,
    row?.name,
  ]
    .map((v) => (v == null ? undefined : String(v).trim()))
    .filter(Boolean) as string[];

  if (isAnon) return candidates[0] || 'Anonymous';
  return candidates[0];
}

export function pickAuthorId(row: any): string | undefined {
  const id =
    row?.authorId ??
    row?.userId ??
    row?.memberId ??
    row?.writerId ??
    row?.ownerId ??
    row?.creatorId ??
    row?.author?.id ??
    row?.user?.id;
  return id != null ? String(id) : undefined;
}

type PostDetailServerResp = { message?: string; data: PostDetail; timestamp?: string };

export async function getPostDetail(postId: number): Promise<PostDetail & { timestamp?: string }> {
  const { data } = await api.get<PostDetailServerResp | (PostDetail & { timestamp?: string })>(
    `/api/v1/posts/${postId}`,
  );

  // 백엔드가 { data, timestamp } 래핑해서 주는 경우
  if ((data as any)?.data) {
    const boxed = data as PostDetailServerResp;
    return { ...boxed.data, timestamp: boxed.timestamp };
  }

  // 평면 객체로 직접 주는 경우
  return data as PostDetail & { timestamp?: string };
}
