import * as Sentry from "@sentry/react";

export const initSentry = () => {
  const dsn = typeof process !== "undefined" && process?.env
    ? process.env.SENTRY_DSN
    : (import.meta.env ? import.meta.env.VITE_SENTRY_DSN : undefined);

  if (dsn) {
    Sentry.init({
      dsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
};
