import { loadErpStore, nextId, nowIso, saveErpStore } from "@/modules/common/store/erp.store";

export function addAuditLog(userId: number | null, action: string, entityType: string, entityId: string, metadata: Record<string, unknown> = {}): void {
  const store = loadErpStore();
  store.auditLogs.push({
    id: nextId(store, "auditLogs"),
    userId,
    action,
    entityType,
    entityId,
    metadata,
    createdAt: nowIso(),
  });
  saveErpStore(store);
}

export function notify(userId: number, title: string, message: string): void {
  const store = loadErpStore();
  store.notifications.push({
    id: nextId(store, "notifications"),
    userId,
    title,
    message,
    isRead: false,
    createdAt: nowIso(),
  });
  saveErpStore(store);
}
