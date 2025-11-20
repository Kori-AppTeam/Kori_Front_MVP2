import { useCallback, useRef } from 'react';
import { FlatList } from 'react-native';

export default function useScrollToTop() {
  const scrollRef = useRef<FlatList>(null);

  const scrollToTop = useCallback((animated: boolean) => {
    if (scrollRef.current) {
      scrollRef.current.scrollToOffset({ offset: 0, animated: animated });
    }
  }, []);

  return { scrollRef, scrollToTop };
}
