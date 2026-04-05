import { CabinClass, FlightTripType, RequestStatus } from "@/modules/common/types";

export const CABIN_CLASSES: CabinClass[] = ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"];
export const TRIP_TYPES: FlightTripType[] = ["OW", "RT", "MC"];
export const REQUEST_STATUSES: RequestStatus[] = [
  "PENDING",
  "ASSIGNED",
  "RESPONDED",
  "ACCEPTED",
  "LOCKED",
  "DOCUMENTS_REQUIRED",
  "PROCESSING",
  "COMPLETED",
  "APPROVED",
  "REJECTED",
];

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function assertNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value.trim();
}

export function assertPositiveNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    throw new Error(`${field} must be a positive number`);
  }
  return value;
}

export function assertStatus(value: unknown): RequestStatus {
  if (typeof value !== "string" || !REQUEST_STATUSES.includes(value as RequestStatus)) {
    throw new Error("Invalid status value");
  }
  return value as RequestStatus;
}
