import { NextRequest } from "next/server";
import { userFlightRoutes } from "@/modules/flights/user/user.flight.routes";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  return userFlightRoutes.getMyFareMessage(request, Number(context.params.id));
}
