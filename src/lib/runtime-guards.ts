import { NextResponse } from "next/server";
import { isAdminEnabled, isAgentEnabled } from "./runtime-config";

export function ensureAgentApiEnabled(): NextResponse | null {
  if (!isAgentEnabled()) {
    return NextResponse.json(
      { error: "Agent API is disabled in current APP_MODE" },
      { status: 404 }
    );
  }
  return null;
}

export function ensureAdminApiEnabled(): NextResponse | null {
  if (!isAdminEnabled()) {
    return NextResponse.json(
      { error: "Admin API is disabled in current APP_MODE" },
      { status: 404 }
    );
  }
  return null;
}
