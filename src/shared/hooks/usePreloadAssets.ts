import { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';

/**
 * 에셋 프리로드 훅
 * - 주어진 에셋 배열을 미리 로드하고, 로드 완료 여부를 반환합니다.
 * - 에셋 로드 여부를 isReady 상태로 확인할 수 있습니다.
 *
 * @param assets 미리 로드할 에셋의 모듈 번호 배열
 * @returns isReady: 에셋 로딩 여부
 */

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
