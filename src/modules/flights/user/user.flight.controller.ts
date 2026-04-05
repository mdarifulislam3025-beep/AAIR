import { NextRequest, NextResponse } from "next/server";
import { err, ok, parseJson } from "@/modules/common/http";
import { authorizeRole } from "@/modules/common/middleware/auth";
import { FLIGHT_CABIN_CLASSES, FLIGHT_TRIP_TYPES } from "@/modules/flights/flight.model";
import {
  acceptFlightResponse,
  createFlightRequest,
  getFlightRequestDetails,
  listUserFlightRequests,
} from "@/modules/flights/flight.service";

function validDateList(dates: unknown): dates is string[] {
  return (
    Array.isArray(dates) &&
    dates.length > 0 &&
    dates.every((d) => typeof d === "string" && !Number.isNaN(Date.parse(d)))
  );
}

export async function listMyFareMessages(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "user");
  if (auth instanceof NextResponse) return auth;
  return ok(listUserFlightRequests(auth.userId), "User flight requests fetched");
}

export async function createFareMessage(request: NextRequest): Promise<NextResponse> {
  const auth = authorizeRole(request, "user");
  if (auth instanceof NextResponse) return auth;

  const body = await parseJson(request);
  const { tripType, from, to, travelDates, pax, cabinClass } = body;

  if (!FLIGHT_TRIP_TYPES.includes(tripType as never)) return err("Invalid tripType", 400);
  if (typeof from !== "string" || typeof to !== "string") return err("Invalid route", 400);
  if (!validDateList(travelDates)) return err("Invalid travelDates", 400);
  if (typeof pax !== "number" || pax < 1 || pax > 20) return err("Invalid pax", 400);
  if (!FLIGHT_CABIN_CLASSES.includes(cabinClass as never)) return err("Invalid cabin class", 400);

  const data = createFlightRequest(auth.userId, {
    tripType: tripType as "OW" | "RT" | "MC",
    from: from.trim().toUpperCase(),
    to: to.trim().toUpperCase(),
    travelDates,
    pax,
    cabinClass: cabinClass as "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST",
  });

  return ok(data, "Flight fare request created", 201);
}

export async function getMyFareMessage(request: NextRequest, id: number): Promise<NextResponse> {
  const auth = authorizeRole(request, "user");
  if (auth instanceof NextResponse) return auth;
  try {
    return ok(
      getFlightRequestDetails(id, auth.userId, "user"),
      "Flight fare request details fetched"
    );
  } catch (e) {
    return err((e as Error).message, 400);
  }
}

export async function acceptFareResponse(request: NextRequest, id: number): Promise<NextResponse> {
  const auth = authorizeRole(request, "user");
  if (auth instanceof NextResponse) return auth;
  const body = await parseJson(request);
  if (typeof body.responseId !== "number") return err("responseId is required", 400);

  try {
    const data = acceptFlightResponse(id, body.responseId, auth.userId);
    return ok(data, "Offer accepted successfully");
  } catch (e) {
    return err((e as Error).message, 400);
  }
}
