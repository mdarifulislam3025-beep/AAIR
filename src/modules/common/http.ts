import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@/modules/common/types";
import { verifyJwt } from "@/modules/common/security/token";

export function ok(data: unknown, message = "Success", status = 200): NextResponse {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function err(message: string, code = 400): NextResponse {
  return NextResponse.json({ success: false, data: null, message, code }, { status: code });
}

export async function parseJson(request: NextRequest): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export type AuthContext = { userId: number; email: string; role: UserRole };

export function authenticate(request: NextRequest): AuthContext | null {
  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice(7);
  const decoded = verifyJwt(token);
  if (!decoded) return null;
  return { userId: Number(decoded.sub), email: decoded.email, role: decoded.role };
}

export function authorize(request: NextRequest, allowed: UserRole[]): AuthContext | null {
  const auth = authenticate(request);
  if (!auth || !allowed.includes(auth.role)) return null;
  return auth;
}
