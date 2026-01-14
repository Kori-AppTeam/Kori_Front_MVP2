import { useCallback, useEffect, useState } from 'react';

/* --- 중복되지 않는 랜덤 인덱스 생성 함수--- */
const pickRandomIndices = (count: number, max: number) => {
  if (count === 0) return [];

  const indices = new Set<number>();
  while (indices.size < count) {
    indices.add(Math.floor(Math.random() * max));
  }

  return [...indices];
};

/* --- 랜덤 인덱스 훅 --- */
export const useRandomIndices = (count: number, max: number) => {
  const [indices, setIndices] = useState<number[]>(() => pickRandomIndices(count, max));

  const refresh = useCallback(() => {
    setIndices(pickRandomIndices(count, max));
  }, [count, max]);

  useEffect(() => {
    setIndices(pickRandomIndices(count, max));
  }, [count, max]);

  return { indices, refresh };
};
