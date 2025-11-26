import { useCallback, useState } from 'react';

type ConfirmState = {
  age: boolean;
  terms: boolean;
  privacy: boolean;
};

export function useConfirmTerms() {
  const [confirms, setConfirms] = useState<ConfirmState>({
    age: false,
    terms: false,
    privacy: false,
  });

  // 전체 동의 여부
  const isConfirmedAll = confirms.age && confirms.terms && confirms.privacy;

  // 개별 항목 토글
  const toggleConfirmed = useCallback((key: keyof ConfirmState) => {
    setConfirms((prev) => {
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  }, []);

  // 전체 동의 토글
  const toggleConfirmedAll = useCallback(() => {
    const next = !isConfirmedAll;
    setConfirms({
      age: next,
      terms: next,
      privacy: next,
    });
  }, [isConfirmedAll]);

  return {
    confirms,
    isConfirmedAll,
    toggleConfirmed,
    toggleConfirmedAll,
  };
}
