import type { ComponentType } from 'react';
import * as Sentry from '@sentry/react-native';

let isSentryInitialized = false;

export function initSentry(): void {
  if (isSentryInitialized) return;

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    isSentryInitialized = true;
    return;
  }

  const environment = __DEV__ ? 'development' : 'production';

  Sentry.init({
    dsn,

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,

    environment,
    // Enable Logs
    enableLogs: true,

    // Configure Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.mobileReplayIntegration()],

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
  });

  isSentryInitialized = true;
}

export function wrapWithSentry<TProps extends Record<string, unknown>>(
  Component: ComponentType<TProps>,
): ComponentType<TProps> {
  return Sentry.wrap(Component as ComponentType<Record<string, unknown>>) as ComponentType<TProps>;
}
