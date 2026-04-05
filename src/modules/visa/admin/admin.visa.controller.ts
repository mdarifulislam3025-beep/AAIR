import { NextRequest, NextResponse } from "next/server";
import { authorizeRole } from "@/modules/common/middleware/auth";
import { err, ok, parseJson } from "@/modules/common/http";
import { listAllGenericRequests, updateGenericRequestStatus } from "@/modules/common/request.service";
import { assertStatus } from "@/modules/common/validation";
import { createPackage } from "@/modules/packages/package.service";

export async function adminCreateVisaPackage(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  if (typeof body.title !== "string" || typeof body.price !== "number") return err("Invalid package payload", 400);
  return ok(createPackage(auth.userId, { type: "visa", title: body.title, description: String(body.description ?? ""), price: body.price, currency: String(body.currency ?? "USD"), availability: Number(body.availability ?? 0) }), "Visa package created", 201);
}

export async function adminListVisaRequests(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  return ok(listAllGenericRequests("visa"), "Visa requests fetched");
}

export async function adminUpdateVisaStatus(request: NextRequest, id: number): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  try {
    const status = assertStatus(body.status);
    return ok(updateGenericRequestStatus(id, "visa", status, auth.userId), "Visa status updated");
  } catch (e) {
    return err((e as Error).message, 400);
  }
}
