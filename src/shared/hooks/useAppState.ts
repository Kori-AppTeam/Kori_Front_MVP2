import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState() {
  const current = useRef<AppStateStatus>(AppState.currentState);
  const [state, setState] = useState<AppStateStatus>(current.current);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      current.current = next;
      setState(next);
    });
    return () => sub.remove();
  }, []);

  return state;
}
