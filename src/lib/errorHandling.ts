/** Report a bounded, non-sensitive error in development without sending raw stack details over the network. */
export const logError = (error: unknown, context: string) => {
  if (!import.meta.env.DEV) return;
  const normalized = error instanceof Error ? error : new Error(String(error));
  console.error(`[${context.slice(0, 64)}]`, normalized);
};
