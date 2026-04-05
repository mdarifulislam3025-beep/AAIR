import { NextRequest, NextResponse } from "next/server";
import { authorizeRole } from "@/modules/common/middleware/auth";
import { err, ok, parseJson } from "@/modules/common/http";
import { createFlightResponse, getFlightRequestDetails, listAssignedFlightRequests } from "@/modules/flights/flight.service";

export async function agentListFareMessages(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "agent");
  if (auth instanceof NextResponse) return auth;
  return ok(listAssignedFlightRequests(auth.userId), "Assigned flight requests fetched");
}

export async function agentGetFareMessage(request: NextRequest, id: number): Promise<NextResponse> {
  const auth = authorizeRole(request, "agent");
  if (auth instanceof NextResponse) return auth;
  try {
    return ok(getFlightRequestDetails(id, auth.userId, "agent"), "Assigned request details fetched");
  } catch (e) {
    return err((e as Error).message, 403);
  }
}

export async function agentRespondFareMessage(request: NextRequest, id: number): Promise<NextResponse> {
  const auth = authorizeRole(request, "agent");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  try {
    const data = createFlightResponse(id, auth.userId, "agent", {
      airline: String(body.airline ?? ""),
      fare: Number(body.fare),
      taxes: Number(body.taxes),
      fees: Number(body.fees),
      currency: String(body.currency ?? "USD"),
      notes: String(body.notes ?? ""),
    });
    return ok(data, "Agent fare response submitted", 201);
  } catch (e) {
    return err((e as Error).message, 400);
  }
}
