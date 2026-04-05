import { NextRequest, NextResponse } from "next/server";
import { AuthContext, authenticate, err } from "@/modules/common/http";
import { UserRole } from "@/modules/common/types";

export function verifyJWT(request: NextRequest): AuthContext | NextResponse {
  const auth = authenticate(request);
  if (!auth) return err("Unauthorized", 401);
  return auth;
}

export function authorizeRole(request: NextRequest, role: UserRole): AuthContext | NextResponse {
  const auth = authenticate(request);
  if (!auth) return err("Unauthorized", 401);
  if (auth.role !== role) return err("Forbidden: role mismatch", 403);
  return auth;
}
