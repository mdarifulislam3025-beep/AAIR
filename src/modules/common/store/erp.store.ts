import fs from "fs";
import path from "path";
import { AuditLog, AuthUser, FlightRequest, FlightResponse, GenericRequest, Notification, TravelPackage } from "@/modules/common/types";

interface OTPRecord {
  email: string;
  otp: string;
  expiresAt: string;
}

interface ErpStore {
  users: AuthUser[];
  otps: OTPRecord[];
  flightRequests: FlightRequest[];
  flightResponses: FlightResponse[];
  genericRequests: GenericRequest[];
  packages: TravelPackage[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  seq: Record<string, number>;
}

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "travel-erp.json");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const defaultStore = (): ErpStore => ({
  users: [],
  otps: [],
  flightRequests: [],
  flightResponses: [],
  genericRequests: [],
  packages: [],
  notifications: [],
  auditLogs: [],
  seq: { users: 0, flightRequests: 0, flightResponses: 0, genericRequests: 0, packages: 0, notifications: 0, auditLogs: 0 },
});

export function nowIso(): string {
  return new Date().toISOString();
}

export function loadErpStore(): ErpStore {
  if (!fs.existsSync(dbPath)) return defaultStore();
  try {
    return JSON.parse(fs.readFileSync(dbPath, "utf-8")) as ErpStore;
  } catch {
    return defaultStore();
  }
}

export function saveErpStore(store: ErpStore): void {
  fs.writeFileSync(dbPath, JSON.stringify(store, null, 2), "utf-8");
}

export function nextId(store: ErpStore, key: keyof ErpStore["seq"]): number {
  store.seq[key] += 1;
  return store.seq[key];
}
