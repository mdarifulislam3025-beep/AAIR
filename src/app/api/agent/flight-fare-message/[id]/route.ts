import { NextRequest } from "next/server";
import { agentFlightRoutes } from "@/modules/flights/agent/agent.flight.routes";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  return agentFlightRoutes.agentGetFareMessage(request, Number(context.params.id));
}
