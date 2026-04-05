import { NextRequest } from "next/server";
import { adminFlightRoutes } from "@/modules/flights/admin/admin.flight.routes";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  return adminFlightRoutes.adminGetFareMessage(request, Number(context.params.id));
}
