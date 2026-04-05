import { NextRequest, NextResponse } from "next/server";
import { authorizeRole } from "@/modules/common/middleware/auth";
import { err, ok, parseJson } from "@/modules/common/http";
import { createGenericRequest, listUserGenericRequests } from "@/modules/common/request.service";

export async function userCreateVisaRequest(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "user");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  if (typeof body.packageId !== "number") return err("packageId is required", 400);
  const data = createGenericRequest(auth.userId, "visa", body);
  return ok(data, "Visa request submitted", 201);
}

export async function userListVisaRequests(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "user");
  if (auth instanceof NextResponse) return auth;
  return ok(listUserGenericRequests(auth.userId, "visa"), "Visa requests fetched");
}
