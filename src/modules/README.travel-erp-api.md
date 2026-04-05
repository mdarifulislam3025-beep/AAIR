# MOHAMMAD AIR INTERNATIONAL TRAVELS - REST API

## Auth
- `POST /api/auth/register`
- `POST /api/auth/verify-otp`
- `POST /api/auth/login`

## Flight Fare Message (Strict role separation)

### User
- `GET /api/user/flight-fare-message`
- `POST /api/user/flight-fare-message`
- `GET /api/user/flight-fare-message/:id`
- `POST /api/user/flight-fare-message/:id/accept`

### Admin
- `GET /api/admin/flight-fare-message`
- `GET /api/admin/flight-fare-message/:id`
- `POST /api/admin/flight-fare-message/:id/respond`
- `POST /api/admin/flight-fare-message/:id/assign`

### Agent
- `GET /api/agent/flight-fare-message`
- `GET /api/agent/flight-fare-message/:id`
- `POST /api/agent/flight-fare-message/:id/respond`

## Other modules
- Visa request: `/api/user/visa-request`, `/api/admin/visa-request`
- Work visa request: `/api/user/work-visa-request`, `/api/admin/work-visa-request`
- Transport: `/api/user/transport-request`, `/api/admin/transport-request`, `/api/agent/transport-request`
- Packages: `/api/admin/package`, `/api/user/package`, `/api/user/package-request`
- Notifications: `/api/user/notifications`
- Admin dashboard: `/api/admin/requests`

## Standard response
```json
{
  "success": true,
  "data": {},
  "message": "string"
}
```
