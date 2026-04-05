import { addAuditLog, notify } from "@/modules/common/audit";
import { loadErpStore, nextId, nowIso, saveErpStore } from "@/modules/common/store/erp.store";
import { CabinClass, FlightTripType } from "@/modules/common/types";

function makeRequestCode(id: number): string {
  return `RFQ-${new Date().getFullYear()}-${String(id).padStart(6, "0")}`;
}

export function createFlightRequest(userId: number, payload: { tripType: FlightTripType; from: string; to: string; travelDates: string[]; pax: number; cabinClass: CabinClass }) {
  const store = loadErpStore();
  const id = nextId(store, "flightRequests");
  const request = {
    id,
    requestId: makeRequestCode(id),
    userId,
    assignedAgentId: null,
    tripType: payload.tripType,
    from: payload.from,
    to: payload.to,
    travelDates: payload.travelDates,
    pax: payload.pax,
    cabinClass: payload.cabinClass,
    status: "PENDING" as const,
    acceptedResponseId: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.flightRequests.push(request);
  saveErpStore(store);
  addAuditLog(userId, "FLIGHT_RFQ_CREATED", "flight_requests", String(request.id), { requestId: request.requestId });
  return request;
}

export function listUserFlightRequests(userId: number) {
  const store = loadErpStore();
  return store.flightRequests.filter((r) => r.userId === userId);
}

export function getFlightRequestDetails(requestId: number, actorUserId: number, role: "user" | "admin" | "agent") {
  const store = loadErpStore();
  const request = store.flightRequests.find((r) => r.id === requestId);
  if (!request) throw new Error("Flight request not found");

  if (role === "user" && request.userId !== actorUserId) throw new Error("Forbidden");
  if (role === "agent" && request.assignedAgentId !== actorUserId) throw new Error("Forbidden");

  const responses = store.flightResponses.filter((r) => r.requestId === requestId);
  return { ...request, responses };
}

export function assignFlightRequest(requestId: number, agentId: number, adminId: number) {
  const store = loadErpStore();
  const request = store.flightRequests.find((r) => r.id === requestId);
  if (!request) throw new Error("Flight request not found");

  request.assignedAgentId = agentId;
  request.status = "ASSIGNED";
  request.updatedAt = nowIso();
  saveErpStore(store);

  notify(agentId, "New flight assignment", `Request ${request.requestId} has been assigned to you.`);
  addAuditLog(adminId, "FLIGHT_RFQ_ASSIGNED", "flight_requests", String(request.id), { agentId });

  return request;
}

export function createFlightResponse(requestId: number, actorId: number, role: "agent" | "admin", payload: { airline: string; fare: number; taxes: number; fees: number; currency: string; notes: string }) {
  const store = loadErpStore();
  const request = store.flightRequests.find((r) => r.id === requestId);
  if (!request) throw new Error("Flight request not found");
  if (["ACCEPTED", "LOCKED"].includes(request.status)) throw new Error("Request is locked");

  if (role === "agent" && request.assignedAgentId !== actorId) {
    throw new Error("Agent is not assigned to this request");
  }

  const response = {
    id: nextId(store, "flightResponses"),
    requestId,
    agentId: actorId,
    role,
    airline: payload.airline,
    fare: payload.fare,
    taxes: payload.taxes,
    fees: payload.fees,
    currency: payload.currency,
    notes: payload.notes,
    isAccepted: false,
    createdAt: nowIso(),
  };

  request.status = "RESPONDED";
  request.updatedAt = nowIso();
  store.flightResponses.push(response);
  saveErpStore(store);

  notify(request.userId, "New flight offer", `A new offer was posted for ${request.requestId}`);
  addAuditLog(actorId, "FLIGHT_RFQ_RESPONDED", "flight_responses", String(response.id), { requestId });

  return response;
}

export function acceptFlightResponse(requestId: number, responseId: number, userId: number) {
  const store = loadErpStore();
  const request = store.flightRequests.find((r) => r.id === requestId);
  if (!request) throw new Error("Flight request not found");
  if (request.userId !== userId) throw new Error("Forbidden");
  if (request.acceptedResponseId) throw new Error("An offer has already been accepted");

  const selected = store.flightResponses.find((r) => r.id === responseId && r.requestId === requestId);
  if (!selected) throw new Error("Response not found");

  store.flightResponses = store.flightResponses.map((res) => ({
    ...res,
    isAccepted: res.id === responseId ? true : res.isAccepted,
  }));
  request.acceptedResponseId = responseId;
  request.status = "LOCKED";
  request.updatedAt = nowIso();
  saveErpStore(store);

  notify(selected.agentId, "Offer accepted", `Your offer for ${request.requestId} was accepted.`);
  addAuditLog(userId, "FLIGHT_RFQ_ACCEPTED", "flight_requests", String(requestId), { responseId });

  return { requestId, responseId, status: request.status };
}

export function listAllFlightRequests(status?: string) {
  const store = loadErpStore();
  return store.flightRequests.filter((r) => (status ? r.status === status : true));
}

export function listAssignedFlightRequests(agentId: number) {
  const store = loadErpStore();
  return store.flightRequests.filter((r) => r.assignedAgentId === agentId);
}
