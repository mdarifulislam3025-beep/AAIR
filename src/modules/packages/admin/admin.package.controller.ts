import { NextRequest, NextResponse } from "next/server";
import { authorizeRole } from "@/modules/common/middleware/auth";
import { err, ok, parseJson } from "@/modules/common/http";
import { createPackage, listPackages } from "@/modules/packages/package.service";

export async function adminCreatePackage(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  if (!["tour", "hajj-umrah", "visa", "work-visa"].includes(String(body.type ?? ""))) return err("Invalid package type", 400);
  if (typeof body.title !== "string" || typeof body.price !== "number") return err("Invalid package payload", 400);
  const data = createPackage(auth.userId, { type: body.type as never, title: body.title, description: String(body.description ?? ""), price: body.price, currency: String(body.currency ?? "USD"), availability: Number(body.availability ?? 0) });
  return ok(data, "Package created", 201);
}

export async function adminListPackages(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  const type = new URL(request.url).searchParams.get("type") || undefined;
  return ok(listPackages(type), "Packages fetched");
}
