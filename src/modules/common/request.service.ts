import { addAuditLog, notify } from "@/modules/common/audit";
import { loadErpStore, nextId, nowIso, saveErpStore } from "@/modules/common/store/erp.store";
import { RequestStatus } from "@/modules/common/types";

export function createGenericRequest(userId: number, module: "visa" | "workVisa" | "transport" | "package", payload: Record<string, unknown>) {
  const store = loadErpStore();
  const entity = {
    id: nextId(store, "genericRequests"),
    userId,
    assignedAgentId: null,
    module,
    status: "PENDING" as RequestStatus,
    payload,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.genericRequests.push(entity);
  saveErpStore(store);
  addAuditLog(userId, `${module.toUpperCase()}_REQUEST_CREATED`, "generic_requests", String(entity.id));
  return entity;
}

export function listUserGenericRequests(userId: number, module: "visa" | "workVisa" | "transport" | "package") {
  const store = loadErpStore();
  return store.genericRequests.filter((r) => r.userId === userId && r.module === module);
}

export function listAllGenericRequests(module: "visa" | "workVisa" | "transport" | "package") {
  const store = loadErpStore();
  return store.genericRequests.filter((r) => r.module === module);
}

export function updateGenericRequestStatus(requestId: number, module: "visa" | "workVisa" | "transport" | "package", status: RequestStatus, actorId: number) {
  const store = loadErpStore();
  const entity = store.genericRequests.find((r) => r.id === requestId && r.module === module);
  if (!entity) throw new Error("Request not found");
  entity.status = status;
  entity.updatedAt = nowIso();
  saveErpStore(store);

  notify(entity.userId, `${module} request updated`, `Your ${module} request #${entity.id} is now ${status}.`);
  addAuditLog(actorId, `${module.toUpperCase()}_STATUS_UPDATED`, "generic_requests", String(entity.id), { status });
  return entity;
}

export function assignGenericRequest(requestId: number, module: "transport", agentId: number, actorId: number) {
  const store = loadErpStore();
  const entity = store.genericRequests.find((r) => r.id === requestId && r.module === module);
  if (!entity) throw new Error("Request not found");
  entity.assignedAgentId = agentId;
  entity.status = "ASSIGNED";
  entity.updatedAt = nowIso();
  saveErpStore(store);

  notify(agentId, `New ${module} assignment`, `Request #${entity.id} assigned to you.`);
  addAuditLog(actorId, `${module.toUpperCase()}_ASSIGNED`, "generic_requests", String(entity.id), { agentId });
  return entity;
}

export function listAssignedGenericRequests(agentId: number, module: "transport") {
  const store = loadErpStore();
  return store.genericRequests.filter((r) => r.assignedAgentId === agentId && r.module === module);
}
