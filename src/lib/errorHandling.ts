import * as Sentry from '@sentry/react';

/** Report an error locally and to Sentry without shipping raw stack details to an API endpoint. */
export const logError = (error: unknown, context: string) => {
  const normalized = error instanceof Error ? error : new Error(String(error));
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, normalized);
  }
  Sentry.captureException(normalized, {
    tags: { context: context.slice(0, 64) },
  });
};
