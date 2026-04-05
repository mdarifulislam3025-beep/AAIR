import { agentGetFareMessage, agentListFareMessages, agentRespondFareMessage } from "@/modules/flights/agent/agent.flight.controller";

export const agentFlightRoutes = { agentListFareMessages, agentGetFareMessage, agentRespondFareMessage };
