export type AppMode = "unified" | "agent" | "admin";

const DEFAULT_AGENT_PORT = 3000;
const DEFAULT_ADMIN_PORT = 3001;

function parsePort(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function getAppMode(): AppMode {
  const mode = process.env.APP_MODE;
  if (mode === "agent" || mode === "admin") return mode;
  return "unified";
}

export function getAgentPort(): number {
  return parsePort(process.env.AGENT_PORT, DEFAULT_AGENT_PORT);
}

export function getAdminPort(): number {
  return parsePort(process.env.ADMIN_PORT, DEFAULT_ADMIN_PORT);
}

export function isAgentEnabled(): boolean {
  const mode = getAppMode();
  return mode === "unified" || mode === "agent";
}

export function isAdminEnabled(): boolean {
  const mode = getAppMode();
  return mode === "unified" || mode === "admin";
}
