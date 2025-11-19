import { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';

export function usePreloadAssets(assets: number[]) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await Promise.all(assets.map((src) => Asset.fromModule(src).downloadAsync()));
      } catch (e) {
        console.warn('Asset preload failed', e);
      } finally {
        if (mounted) setIsReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [assets]);

  return { isReady };
}
