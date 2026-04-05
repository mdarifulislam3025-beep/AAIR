import { NextRequest, NextResponse } from "next/server";
import { authorizeRole } from "@/modules/common/middleware/auth";
import { err, ok, parseJson } from "@/modules/common/http";
import { createGenericRequest, listUserGenericRequests } from "@/modules/common/request.service";

export async function userCreateTransportRequest(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "user");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  if (!["bus", "train"].includes(String(body.mode ?? ""))) return err("mode must be bus or train", 400);
  return ok(createGenericRequest(auth.userId, "transport", body), "Transport request submitted", 201);
}

export async function userListTransportRequests(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "user");
  if (auth instanceof NextResponse) return auth;
  return ok(listUserGenericRequests(auth.userId, "transport"), "Transport requests fetched");
}
