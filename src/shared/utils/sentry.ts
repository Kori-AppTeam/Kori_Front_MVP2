import type { ComponentType } from 'react';
import * as Sentry from '@sentry/react-native';
import axios from 'axios';

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

/**
 * 에러를 컨텍스트와 함께 Sentry에 캡처합니다.
 * Axios 에러, 일반 Error, 기타 에러 타입을 자동으로 감지하여 상세 정보를 추출합니다.
 *
 * @param error - 캡처할 에러 객체
 * @param context - 에러 발생 위치 및 추가 컨텍스트 정보
 */
export function captureErrorWithContext(
  error: unknown,
  context: {
    location: string;
    additionalData?: Record<string, any>;
    tags?: Record<string, string>;
    level?: Sentry.SeverityLevel;
  },
) {
  const { location, additionalData = {}, tags = {}, level = 'error' } = context;

  // 에러 상세 정보 추출
  const errorInfo: Record<string, any> = {
    ...additionalData,
    timestamp: new Date().toISOString(),
  };

  // Axios 에러인 경우
  if (axios.isAxiosError(error)) {
    errorInfo.type = 'AxiosError';
    errorInfo.status = error.response?.status;
    errorInfo.statusText = error.response?.statusText;
    errorInfo.responseData = error.response?.data;
    errorInfo.requestUrl = error.config?.url;
    errorInfo.requestMethod = error.config?.method;
    errorInfo.message = error.message;
    errorInfo.code = error.code;
  }
  // 일반 Error 객체인 경우
  else if (error instanceof Error) {
    errorInfo.type = 'Error';
    errorInfo.name = error.name;
    errorInfo.message = error.message;
    errorInfo.stack = error.stack;
  }
  // 기타 에러
  else {
    errorInfo.type = 'Unknown';
    errorInfo.rawError = String(error);
  }

  // Sentry에 상세 정보와 함께 캡처
  Sentry.captureException(error, {
    tags: {
      error_location: location,
      ...tags,
    },
    contexts: {
      error_details: errorInfo,
    },
    level,
  });
}

/**
 * Sentry breadcrumb를 추가합니다.
 *
 * @param breadcrumb - breadcrumb 정보
 */
export function addSentryBreadcrumb(breadcrumb: {
  category: string;
  message: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, any>;
}) {
  Sentry.addBreadcrumb({
    category: breadcrumb.category,
    message: breadcrumb.message,
    level: breadcrumb.level || 'info',
    data: breadcrumb.data,
  });
}
