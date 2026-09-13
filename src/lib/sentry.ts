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
        Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.05,
      replaysOnErrorSampleRate: 0.25,
      beforeSend(event) {
        if (event.request) {
          delete event.request.cookies;
          delete event.request.headers;
          delete event.request.data;
        }
        return event;
      },
    });
  }
};
