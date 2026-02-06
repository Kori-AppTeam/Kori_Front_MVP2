import * as SecureStore from 'expo-secure-store';

export async function getSecureStoreItem(key: string): Promise<string | null> {
  return withFixedTimeout(SecureStore.getItemAsync(key), null);
}

export async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => resolve(fallback), ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

const FIXED_TIMEOUT_MS = 2500;

export function withFixedTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return withTimeout(promise, FIXED_TIMEOUT_MS, fallback);
}
