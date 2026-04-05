import { NextRequest } from "next/server";
import { userFlightRoutes } from "@/modules/flights/user/user.flight.routes";

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  return userFlightRoutes.acceptFareResponse(request, Number(context.params.id));
}
