import { NextRequest, NextResponse } from "next/server";
import { authorizeRole } from "@/modules/common/middleware/auth";
import { err, ok, parseJson } from "@/modules/common/http";
import { assignFlightRequest, createFlightResponse, getFlightRequestDetails, listAllFlightRequests } from "@/modules/flights/flight.service";

export async function adminListFareMessages(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  const status = new URL(request.url).searchParams.get("status") || undefined;
  return ok(listAllFlightRequests(status), "All flight requests fetched");
}

export async function adminGetFareMessage(request: NextRequest, id: number): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  try {
    return ok(getFlightRequestDetails(id, auth.userId, "admin"), "Flight request details fetched");
  } catch (e) {
    return err((e as Error).message, 404);
  }
}

export async function adminRespondFareMessage(request: NextRequest, id: number): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  try {
    const data = createFlightResponse(id, auth.userId, "admin", {
      airline: String(body.airline ?? ""),
      fare: Number(body.fare),
      taxes: Number(body.taxes),
      fees: Number(body.fees),
      currency: String(body.currency ?? "USD"),
      notes: String(body.notes ?? ""),
    });
    return ok(data, "Admin fare response submitted", 201);
  } catch (e) {
    return err((e as Error).message, 400);
  }
}

export async function adminAssignFareMessage(request: NextRequest, id: number): Promise<NextResponse> {
  const auth = authorizeRole(request, "admin");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  if (typeof body.agentId !== "number") return err("agentId is required", 400);

  try {
    const data = assignFlightRequest(id, body.agentId, auth.userId);
    return ok(data, "Agent assigned successfully");
  } catch (e) {
    return err((e as Error).message, 400);
  }
}
