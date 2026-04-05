import { NextRequest, NextResponse } from "next/server";
import { authorizeRole } from "@/modules/common/middleware/auth";
import { ok } from "@/modules/common/http";
import { listAssignedGenericRequests } from "@/modules/common/request.service";

export async function agentListTransportRequests(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "agent");
  if (auth instanceof NextResponse) return auth;
  return ok(listAssignedGenericRequests(auth.userId, "transport"), "Assigned transport requests fetched");
}
