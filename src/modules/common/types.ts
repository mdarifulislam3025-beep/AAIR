export type UserRole = "customer" | "agent" | "admin";

export type FlightTripType = "OW" | "RT" | "MC";
export type CabinClass = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";

export type RequestStatus =
  | "PENDING"
  | "ASSIGNED"
  | "RESPONDED"
  | "ACCEPTED"
  | "LOCKED"
  | "DOCUMENTS_REQUIRED"
  | "PROCESSING"
  | "COMPLETED"
  | "APPROVED"
  | "REJECTED";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  emailVerified: boolean;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlightRequest {
  id: number;
  requestId: string;
  userId: number;
  assignedAgentId: number | null;
  tripType: FlightTripType;
  from: string;
  to: string;
  travelDates: string[];
  pax: number;
  cabinClass: CabinClass;
  status: RequestStatus;
  acceptedResponseId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface FlightResponse {
  id: number;
  requestId: number;
  agentId: number;
  role: "agent" | "admin";
  airline: string;
  fare: number;
  taxes: number;
  fees: number;
  currency: string;
  notes: string;
  isAccepted: boolean;
  createdAt: string;
}

export interface GenericRequest {
  id: number;
  userId: number;
  assignedAgentId: number | null;
  module: "visa" | "workVisa" | "transport" | "package";
  status: RequestStatus;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface TravelPackage {
  id: number;
  type: "tour" | "hajj-umrah" | "visa" | "work-visa";
  title: string;
  description: string;
  price: number;
  currency: string;
  availability: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  userId: number | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
