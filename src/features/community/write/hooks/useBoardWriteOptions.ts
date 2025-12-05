import { useQuery } from '@tanstack/react-query';

import { getBoardWriteOptions } from '../apis/boards';
import { BoardWriteOptions } from '../types';

export function useBoardWriteOptions(boardId?: number) {
  return useQuery<BoardWriteOptions>({
    queryKey: ['board', boardId, 'write-options'],
    queryFn: () => getBoardWriteOptions(boardId as number),
    enabled: typeof boardId === 'number' && !Number.isNaN(boardId),
    staleTime: 5 * 60 * 1000,
  });
}
