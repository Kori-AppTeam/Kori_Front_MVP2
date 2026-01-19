import { useEffect, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { ProfileSetupFormValues } from '@/src/features/profile-setup/types';
import { hydratePrefill } from '@/src/features/profile-setup/lib/prefill';

export function useHydratePrefill(methods: UseFormReturn<ProfileSetupFormValues>) {
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    hydratePrefill(methods).catch((e) => {
      console.warn('[profile-setup] prefill hydrate failed', e);
    });
  }, [methods]);
}
