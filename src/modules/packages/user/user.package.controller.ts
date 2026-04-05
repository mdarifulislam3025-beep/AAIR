import { NextRequest, NextResponse } from "next/server";
import { authorizeRole } from "@/modules/common/middleware/auth";
import { err, ok, parseJson } from "@/modules/common/http";
import { createGenericRequest, listUserGenericRequests } from "@/modules/common/request.service";
import { listPackages } from "@/modules/packages/package.service";

export async function userListPackages(request: NextRequest): Promise<NextResponse> {
  const type = new URL(request.url).searchParams.get("type") || undefined;
  return ok(listPackages(type), "Packages fetched");
}

export async function userCreatePackageRequest(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "user");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  if (typeof body.packageId !== "number") return err("packageId is required", 400);
  return ok(createGenericRequest(auth.userId, "package", body), "Package request submitted", 201);
}

export async function userListPackageRequests(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "user");
  if (auth instanceof NextResponse) return auth;
  return ok(listUserGenericRequests(auth.userId, "package"), "Package requests fetched");
}
