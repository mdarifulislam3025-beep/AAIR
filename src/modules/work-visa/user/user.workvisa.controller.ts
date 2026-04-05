import { NextRequest, NextResponse } from "next/server";
import { authorizeRole } from "@/modules/common/middleware/auth";
import { err, ok, parseJson } from "@/modules/common/http";
import { createGenericRequest, listUserGenericRequests } from "@/modules/common/request.service";

export async function userCreateWorkVisaRequest(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "customer");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  if (typeof body.packageId !== "number" || typeof body.cvUrl !== "string") return err("packageId and cvUrl are required", 400);
  return ok(createGenericRequest(auth.userId, "workVisa", body), "Work visa request submitted", 201);
}

export async function userListWorkVisaRequests(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "customer");
  if (auth instanceof NextResponse) return auth;
  return ok(listUserGenericRequests(auth.userId, "workVisa"), "Work visa requests fetched");
}
