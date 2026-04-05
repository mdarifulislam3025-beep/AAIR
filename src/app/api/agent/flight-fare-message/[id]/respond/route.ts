import { NextRequest } from "next/server";
import { agentFlightRoutes } from "@/modules/flights/agent/agent.flight.routes";

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  return agentFlightRoutes.agentRespondFareMessage(request, Number(context.params.id));
}
