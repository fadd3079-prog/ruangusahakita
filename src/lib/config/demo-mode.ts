import "server-only";

export function isDemoMode() {
  return process.env.APP_DEMO_MODE === "true";
}
