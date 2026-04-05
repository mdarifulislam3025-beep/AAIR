import { NextRequest, NextResponse } from "next/server";
import { authorizeRole } from "@/modules/common/middleware/auth";
import { err, ok, parseJson } from "@/modules/common/http";
import { assignGenericRequest, listAllGenericRequests, updateGenericRequestStatus } from "@/modules/common/request.service";

export async function adminListTransportRequests(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  return ok(listAllGenericRequests("transport"), "Transport requests fetched");
}

export async function adminAssignTransportRequest(request: NextRequest, id: number): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  if (typeof body.agentId !== "number") return err("agentId is required", 400);
  try {
    return ok(assignGenericRequest(id, "transport", body.agentId, auth.userId), "Transport request assigned");
  } catch (e) {
    return err((e as Error).message, 400);
  }
}

export async function adminUpdateTransportStatus(request: NextRequest, id: number): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  if (typeof body.status !== "string") return err("status is required", 400);
  try {
    return ok(updateGenericRequestStatus(id, "transport", body.status as never, auth.userId), "Transport status updated");
  } catch (e) {
    return err((e as Error).message, 400);
  }
}
