import { NextRequest } from "next/server";
import { adminFlightRoutes } from "@/modules/flights/admin/admin.flight.routes";

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  return adminFlightRoutes.adminAssignFareMessage(request, Number(context.params.id));
}
