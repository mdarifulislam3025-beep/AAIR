# Travel Marketplace Platform — Product & Technical Specification

## 1) Product Positioning

This platform is **not** a direct booking engine. It is a controlled travel marketplace where:

1. Users submit travel/visa/package/transport requests.
2. Requests become visible to internal ERP and agents.
3. Agents provide manual offers/quotes.
4. Users accept one offer.
5. The system locks the request and tracks lifecycle, audit, and SLA.

---

## 2) Scope (Phase 1)

### In scope
- Flight RFQ (One-way, Round-trip, Multi-city)
- Visa processing requests
- Tour package requests
- Hajj/Umrah package requests
- Work visa requests
- Bus/Train RFQ requests
- User and role management
- Notifications
- Audit and compliance logging
- SLA tracking for response deadlines

### Out of scope (for this phase)
- Payment processing
- Automated fare shopping/live airline connectivity
- Fully automated pricing engine

---

## 3) User Roles

- **Customer**: creates requests, tracks status, accepts offer.
- **Agent**: views assigned request queue, submits one or multiple offers.
- **Admin**: manages users, packages, assignment policies, and monitoring.

---

## 4) Functional Requirements

## 4.1 User Management

### Features
- Register/Login (email; optional phone OTP expansion)
- Role-based access control (Customer, Agent, Admin)
- Any action button requiring auth should trigger Register/Login modal/pop-up

### 4.1.1 Registration flow
- Input: email + password
- Register action triggers email OTP verification
- Account becomes active only after OTP verification

### 4.1.2 Login flow
- Input: verified email + password
- Success only for verified users

#### Error messages
- If email is not found:
  - `Your email is not registered, please sign up.`
- If password is invalid:
  - `Wrong password. Please provide your correct password or reset your password.`

### Acceptance criteria
- Unique email (and phone, if used) enforced
- JWT issued on successful login
- Role validation enforced on protected routes

---

## 4.2 Flight RFQ Module (Core)

### User actions
Submit request with:
- Trip type: `OW | RT | MC`
- Origin / destination
- Travel dates
- Passenger count
- Cabin class

### System behavior
- Generate unique Request ID
- Set initial status = `Pending`
- Assign agent (`manual` or `auto`)

### Agent actions
- View request queue
- Submit multiple offers per request

### Acceptance criteria
- Multiple responses allowed per request
- Response includes complete pricing breakdown
- User can accept only one offer
- After acceptance, request is locked from further acceptance changes

---

## 4.3 Visa Processing

### Features
- Admin creates visa packages
- User submits visa request
- User uploads required documents

### Status flow
- `Pending`
- `Documents Required`
- `Processing`
- `Completed`
- Terminal decision: `Approved` or `Rejected`

---

## 4.4 Tour Packages

- Admin creates packages
- Users submit package request
- ERP tracks availability and fulfillment lifecycle

---

## 4.5 Hajj / Umrah Packages

- Admin creates package catalog
- Users request package slots
- ERP tracks quota/availability

---

## 4.6 Work Visa

### Features
- Admin creates work visa packages
- User submits request
- User uploads required documents and CV

### Status flow
- `Pending`
- `Documents Required`
- `Processing`
- Terminal decision: `Approved` or `Rejected`
- `Completed`

### Pipeline stages
- `Lead`
- `Submitted`
- `Approved` or `Rejected`

---

## 4.7 Transport Module

- Bus/Train request submission
- Reuses RFQ logic pattern similar to flight requests

---

## 4.8 Notifications

Trigger notifications on:
- New request created
- Agent response submitted
- Offer accepted by user

---

## 5) Non-Functional Requirements

### Performance
- Support 1000+ daily requests
- API response time target: < 300ms (excluding third-party dependencies)

### Scalability
- Stateless API design
- Horizontal scaling ready

### Security
- JWT authentication
- Password hashing using bcrypt
- Role-based authorization middleware

### Audit & Compliance
- Log all business-critical actions
- Retain logs per Bangladesh travel regulatory requirements

---

## 6) API Contract (Summary)

| Module | Endpoint | Method |
|---|---|---|
| Auth | `/auth/login` | POST |
| Flights | `/flights/request` | POST |
| Flights | `/flights/respond` | POST |
| Flights | `/flights/accept` | POST |
| Visa | `/visa/request` | POST |
| Admin | `/admin/requests` | GET |

---

## 7) Error Handling Standard

```json
{
  "status": "error",
  "message": "Invalid request",
  "code": 400
}
```

---

## 8) Logging Strategy

Mandatory logs:
- Request logs
- Response logs
- Agent action logs
- Error logs

Recommended additional fields:
- `request_id`, `user_id`, `agent_id`, `module`, `action`, `status_before`, `status_after`, `timestamp`, `trace_id`

---

## 9) SLA Rules

- Agent response target: within 15 minutes of request creation
- Alert operations team when SLA is breached
- RFQ offers should have explicit validity/expiry and auto-expire behavior

---

## 10) Current Limitations

- Manual pricing dependency
- No real-time airline inventory/fare feeds
- Strong dependency on disciplined internal agent workflows/SOP

---

## 11) Data Model (ERD Summary)

### Core relationships

- `users` 1—N `flight_requests`
- `flight_requests` 1—N `flight_responses`
- `users` 1—N `visa_requests`
- `users` 1—N `work_visa_requests`
- `users` 1—N `transport_requests`
- `users` 1—N `package_requests`
- `packages` 1—N `package_requests`
- `users` 1—N `notifications`
- `users` 1—N `audit_logs`

### Table skeleton

- **users**: `id (PK)`, `name`, `email`, `phone`, `role`
- **flight_requests**: `id (PK)`, `user_id (FK)`, `assigned_agent (FK)`, `status`
- **flight_responses**: `id (PK)`, `request_id (FK)`, `agent_id (FK)`
- **visa_requests**: `id (PK)`, `user_id (FK)`
- **packages**: `id (PK)`
- **package_requests**: `user_id (FK)`, `package_id (FK)`
- **work_visa_requests**: `user_id (FK)`
- **transport_requests**: `user_id (FK)`
- **notifications**: `user_id (FK)`
- **audit_logs**: `user_id (FK)`

---

## 12) Critical Data Flow

1. User submits request.
2. Request stored in DB.
3. Request visible in ERP/agent queue.
4. Agent submits one or more offers.
5. User receives notification.
6. User accepts one offer.
7. System locks request and records audit trail.

---

## 13) Delivery Plan (Team Next Steps)

### Backend
- Implement schema and migrations
- Build APIs per module
- Add validation and business-rule layer
- Implement assignment and SLA workers

### Frontend
- Connect request forms to APIs
- Add timeline/status UI states (`pending/replied/accepted/expired`)
- Add auth modal trigger on protected actions

### QA (Critical test cases)
- Multiple responses per request
- Single-accept enforcement
- Offer expiry enforcement
- SLA breach alerts
- Auth/role protection and audit log coverage

### DevOps
- Deploy staging environment
- Set up centralized logs + SLA alerting dashboards

---

## 14) Strategic Recommendation

Add an **Agent Performance Engine** with metrics:
- Response time
- Conversion rate
- Revenue per agent

This creates measurable operational visibility and improves service quality.
