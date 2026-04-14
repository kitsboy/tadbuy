export const logError = (error: any, context: string) => {
  console.error(`[${context}]`, error);
  fetch("/api/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null,
      context,
      timestamp: new Date().toISOString()
    })
  }).catch(console.error);
};
