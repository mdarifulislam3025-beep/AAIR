import { NextRequest, NextResponse } from "next/server";
import { authorizeRole } from "@/modules/common/middleware/auth";
import { err, ok, parseJson } from "@/modules/common/http";
import { listAllGenericRequests, updateGenericRequestStatus } from "@/modules/common/request.service";
import { createPackage } from "@/modules/packages/package.service";

export async function adminCreateWorkVisaPackage(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  if (typeof body.title !== "string" || typeof body.price !== "number") return err("Invalid package payload", 400);
  return ok(createPackage(auth.userId, { type: "work-visa", title: body.title, description: String(body.description ?? ""), price: body.price, currency: String(body.currency ?? "USD"), availability: Number(body.availability ?? 0) }), "Work visa package created", 201);
}

export async function adminListWorkVisaRequests(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  return ok(listAllGenericRequests("workVisa"), "Work visa requests fetched");
}

export async function adminUpdateWorkVisaStatus(request: NextRequest, id: number): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  if (typeof body.status !== "string") return err("status is required", 400);
  try {
    return ok(updateGenericRequestStatus(id, "workVisa", body.status as never, auth.userId), "Work visa status updated");
  } catch (e) {
    return err((e as Error).message, 400);
  }
}
