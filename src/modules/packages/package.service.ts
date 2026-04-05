import { loadErpStore, nextId, nowIso, saveErpStore } from "@/modules/common/store/erp.store";

export function createPackage(adminId: number, payload: { type: "tour" | "hajj-umrah" | "visa" | "work-visa"; title: string; description: string; price: number; currency: string; availability: number; }) {
  const store = loadErpStore();
  const entity = {
    id: nextId(store, "packages"),
    ...payload,
    createdBy: adminId,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.packages.push(entity);
  saveErpStore(store);
  return entity;
}

export function listPackages(type?: string) {
  const store = loadErpStore();
  return store.packages.filter((p) => (type ? p.type === type : true));
}
