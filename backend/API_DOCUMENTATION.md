# SmartHeal Backend API Documentation

## Overview

Production-grade backend for the SmartHeal React Native mobile application. Built with Node.js, Express, PostgreSQL, and Firebase authentication.

### Architecture Principles

- **Single Source of Truth**: All business logic lives in the backend
- **Frontend-Agnostic APIs**: Work with any frontend (mobile, web, etc.)
- **Role-Based Access Control (RBAC)**: 4 roles - Admin, Therapist, Support, Client
- **Clean Architecture**: Services handle logic, controllers validate, routes orchestrate
- **Security First**: Firebase JWT validation on all protected endpoints

---

## Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# - DB credentials
# - Firebase credentials
```

### 2. Start PostgreSQL

```bash
npm run docker:up
```

### 3. Run Migrations

```bash
npm run migrate:latest
```

### 4. Start Server

```bash
npm start        # Production
npm run dev      # Development with auto-reload
```

---

## Authentication

### JWT Verification Flow

1. **Frontend**: Sends Firebase ID token in Authorization header
2. **Backend**:
   - Extracts token from `Authorization: Bearer <token>`
   - Verifies using Firebase Admin SDK
   - Resolves user from database
   - Attaches user to request object
   - Enforces role-based access

### All Protected Endpoints Require

```
Authorization: Bearer <firebase_id_token>
```

---

## API Endpoints

### Base URL

```
http://localhost:3000/api/v1
```

---

## 🧑 USER ENDPOINTS

### Get Current User Profile

```
GET /users/profile
```

**Authentication**: Required  
**Authorization**: All roles  
**Response**:

```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "id": "uuid",
    "firebase_uid": "string",
    "role": "admin|therapist|support|client",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890",
    "profile_image_url": "https://...",
    "bio": "Bio text",
    "is_active": true,
    "created_at": "2026-03-22T...",
    "updated_at": "2026-03-22T..."
  }
}
```

### Update User Profile

```
PUT /users/profile
```

**Authentication**: Required  
**Authorization**: All roles  
**Request Body**:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "profile_image_url": "https://...",
  "bio": "My bio"
}
```

**Response**: Updated user object

### Get All Users (Admin Only)

```
GET /users?role=therapist&limit=50&offset=0
```

**Authentication**: Required  
**Authorization**: admin  
**Query Parameters**:

- `role` (optional): Filter by role - admin, therapist, support, client
- `limit` (optional): Results per page (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response**:

```json
{
  "success": true,
  "data": {
    "data": [...users],
    "total": 100,
    "limit": 50,
    "offset": 0
  }
}
```

### Get Specific User (Admin Only)

```
GET /users/:userId
```

**Authentication**: Required  
**Authorization**: admin  
**Response**: User object

### Update User Role (Admin Only)

```
PUT /users/:userId/role
```

**Authentication**: Required  
**Authorization**: admin  
**Request Body**:

```json
{
  "role": "therapist"
}
```

**Valid Roles**: admin, therapist, support, client

### Deactivate User (Admin Only)

```
PUT /users/:userId/deactivate
```

**Authentication**: Required  
**Authorization**: admin

---

## 👥 CLIENT ENDPOINTS

### Create Client Profile

```
POST /clients
```

**Authentication**: Required  
**Authorization**: All roles  
**Request Body**:

```json
{
  "diagnosis": "depression",
  "medical_history": "Previous anxiety issues",
  "emergency_contact_name": "Jane Doe",
  "emergency_contact_phone": "+1234567890",
  "session_preference": "weekly",
  "session_duration_minutes": 60,
  "timezone": "America/New_York"
}
```

**Response**: Client object with user info

### Get Current User's Client Profile

```
GET /clients/my-profile
```

**Authentication**: Required  
**Authorization**: client  
**Response**: Client object

### Get Client Profile

```
GET /clients/:clientId
```

**Authentication**: Required  
**Authorization**: All roles  
**Response**: Client object with details

### Update Client Profile

```
PUT /clients/:clientId
```

**Authentication**: Required  
**Authorization**: All roles  
**Request Body**: Any client fields to update  
**Response**: Updated client object

### Get Client Progress

```
GET /clients/:clientId/progress
```

**Authentication**: Required  
**Authorization**: Any role  
**Response**:

```json
{
  "success": true,
  "data": {
    "client": {...},
    "totalSessionsCompleted": 15,
    "riskScore": 45,
    "sessions": [
      {
        "id": "uuid",
        "date": "2026-03-20T...",
        "riskBefore": 55,
        "riskAfter": 45,
        "progress": "Good progress"
      }
    ]
  }
}
```

### Get Client Risk Score

```
GET /clients/:clientId/risk-score
```

**Authentication**: Required  
**Authorization**: Any role  
**Business Logic**: Recalculates risk score based on:

- Recent session completion rate
- Progress trend from last 3 sessions
- Historical risk improvements

**Response**:

```json
{
  "success": true,
  "data": {
    "clientId": "uuid",
    "riskScore": 45,
    "client": {...}
  }
}
```

### Get All Clients (Admin/Support Only)

```
GET /clients?limit=50&offset=0
```

**Authentication**: Required  
**Authorization**: admin, support

---

## 🏥 THERAPIST ENDPOINTS

### Create Therapist Profile (Admin Only)

```
POST /therapists
```

**Authentication**: Required  
**Authorization**: admin  
**Request Body**:

```json
{
  "user_id": "uuid",
  "license_number": "LIC123456",
  "specialization": "Depression Treatment",
  "certifications": "CBT, EMDR",
  "years_of_experience": 5,
  "available_hours": {
    "monday": [9, 10, 14, 15],
    "tuesday": [9, 10, 11]
  },
  "accepting_new_clients": true,
  "max_clients": 20
}
```

**Response**: Therapist object

### Get Ranked Therapists

```
GET /therapists/ranked?specialization=Depression&limit=50
```

**Authentication**: Required  
**Authorization**: Any role  
**Business Logic**:

- Ranks by: rating, experience, availability
- Only includes: accepting_new_clients=true
- Calculates ranking_score (0-100)

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "average_rating": 4.5,
      "years_of_experience": 8,
      "total_sessions": 150,
      "current_clients": 15,
      "ranking_position": 1,
      "ranking_score": 92,
      ...
    }
  ]
}
```

### Get Current Therapist Profile

```
GET /therapists/my-profile
```

**Authentication**: Required  
**Authorization**: therapist

### Get All Therapists

```
GET /therapists?limit=50&offset=0
```

**Authentication**: Required  
**Authorization**: Any role

### Get All Specializations

```
GET /therapists/specializations
```

**Authentication**: Required  
**Authorization**: Any role  
**Response**:

```json
{
  "success": true,
  "data": ["Depression Treatment", "Anxiety", "Trauma"]
}
```

### Update Therapist Profile

```
PUT /therapists/:therapistId
```

**Authentication**: Required  
**Authorization**: therapist (own), admin  
**Request Body**: Therapist fields to update

### Add Review to Therapist

```
POST /therapists/:therapistId/review
```

**Authentication**: Required  
**Authorization**: Any role  
**Request Body**:

```json
{
  "rating": 4.5
}
```

**Valid Ratings**: 1-5  
**Backend Logic**: Updates average_rating and total_reviews

---

## 📅 SESSION ENDPOINTS

### Create Session

```
POST /sessions
```

**Authentication**: Required  
**Authorization**: admin, therapist  
**Request Body**:

```json
{
  "client_id": "uuid",
  "therapist_id": "uuid",
  "session_datetime": "2026-03-25T10:00:00Z",
  "duration_minutes": 60,
  "notes": "Initial consultation"
}
```

### Get Session

```
GET /sessions/:sessionId
```

**Authentication**: Required  
**Authorization**: Any role

### Update Session

```
PUT /sessions/:sessionId
```

**Authentication**: Required  
**Authorization**: Any role  
**Request Body**: Fields to update

### Complete Session

```
PUT /sessions/:sessionId/complete
```

**Authentication**: Required  
**Authorization**: therapist, admin  
**Request Body**:

```json
{
  "notes": "Session went well",
  "client_rating": 4.5,
  "client_feedback": "Great session",
  "risk_score_before": 55,
  "risk_score_after": 45,
  "progress_category": "improvement",
  "progress_notes": "Client showed good progress"
}
```

**Backend Logic**:

- Updates session status to "completed"
- Increments client completed_sessions count
- Updates therapist total_sessions
- Updates therapist average_rating if client_rating provided
- Updates client last_session_date

### Cancel Session

```
PUT /sessions/:sessionId/cancel
```

**Authentication**: Required  
**Authorization**: Any role  
**Request Body**:

```json
{
  "reason": "Client requested cancellation"
}
```

### Get Client Sessions

```
GET /sessions/client/:clientId?status=completed&limit=50&offset=0
```

**Authentication**: Required  
**Authorization**: Any role  
**Query Parameters**:

- `status` (optional): scheduled, in_progress, completed, cancelled, no_show
- `limit`, `offset`: Pagination

### Get Therapist Sessions

```
GET /sessions/therapist/:therapistId?status=scheduled
```

**Authentication**: Required  
**Authorization**: Any role

### Get Session Statistics

```
GET /sessions/stats?startDate=2026-03-01&endDate=2026-03-31
```

**Authentication**: Required  
**Authorization**: admin, support  
**Response**:

```json
{
  "success": true,
  "data": {
    "scheduled": 45,
    "in_progress": 5,
    "completed": 120,
    "cancelled": 10,
    "no_show": 2
  }
}
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

---

## HTTP Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | Success                              |
| 201  | Created                              |
| 400  | Validation error                     |
| 401  | Unauthorized (missing/invalid token) |
| 403  | Forbidden (insufficient permissions) |
| 404  | Not found                            |
| 500  | Internal server error                |

---

## Error Handling

### Common Errors

**Missing Authorization Header**

```json
{
  "success": false,
  "message": "Missing or invalid Authorization header",
  "data": null
}
```

Status: 401

**Insufficient Permissions**

```json
{
  "success": false,
  "message": "Insufficient permissions for this action",
  "data": null
}
```

Status: 403

**Validation Error**

```json
{
  "success": false,
  "message": "Validation error",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "must be a valid email"
      }
    ]
  }
}
```

Status: 400

---

## Database Schema

### Users Table

- id (uuid, PK)
- firebase_uid (string, unique)
- role (enum: admin, therapist, support, client)
- email, first_name, last_name
- phone_number, profile_image_url, bio
- is_active (boolean)
- timestamps

### Clients Table

- id (uuid, PK)
- user_id (uuid, FK → Users)
- diagnosis, medical_history
- session_preference, session_duration_minutes
- timezone
- total_sessions, completed_sessions
- risk_score, last_session_date
- timestamps

### Therapists Table

- id (uuid, PK)
- user_id (uuid, FK → Users)
- license_number, specialization, certifications
- years_of_experience
- average_rating, total_reviews, total_sessions
- available_hours (JSON)
- accepting_new_clients, max_clients, current_clients
- timestamps

### Sessions Table

- id (uuid, PK)
- client_id (uuid, FK), therapist_id (uuid, FK)
- status (enum: scheduled, in_progress, completed, cancelled, no_show)
- session_datetime, duration_minutes
- notes, session_data (JSON)
- client_rating, client_feedback
- risk_score_before, risk_score_after
- progress_category, progress_notes
- timestamps

### Analytics Table

- id (uuid, PK)
- user_id (uuid, FK)
- metric_type, metric_value
- metric_date
- metadata (JSON)
- timestamps

---

## Key Business Logic (Backend Only)

### Risk Score Calculation

- Base score: 50
- Decrease: -2 per completed session
- Improvement detection: -10 if recent trend shows improvement
- Clamped: 0-100

### Therapist Ranking

- Rating: 40%
- Experience: 30%
- Availability: 30%
- Only includes: accepting_new_clients=true AND current_clients < max_clients

### Session Completion

- Updates client counters
- Updates therapist rating if feedback provided
- Records risk score changes
- Tracks progress metrics

---

## Development

### Run Migrations

```bash
npm run migrate:latest
npm run migrate:rollback
npm run migrate:make 006_create_new_table
```

### Environment Variables

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartheal_db
DB_USER=postgres
DB_PASSWORD=postgres123
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY=your-key
FIREBASE_CLIENT_EMAIL=your-email@firebase.gserviceaccount.com
API_VERSION=v1
CORS_ORIGIN=http://localhost:3000,http://localhost:19000
```

### Linting

```bash
npm run lint
```

---

## Deployment

### Docker: PostgreSQL

```bash
# Start
npm run docker:up

# Logs
npm run docker:logs

# Stop
npm run docker:down
```

### Deployment Checklist

- [ ] Set production DATABASE_URL
- [ ] Set production Firebase credentials
- [ ] Enable SSL for database
- [ ] Set CORS_ORIGIN to frontend domains
- [ ] Enable HTTPS
- [ ] Setup logging/monitoring
- [ ] Run migrations on production
- [ ] Configure backups

---

## Security

- ✅ Firebase JWT verification on all protected routes
- ✅ Role-based access control (RBAC)
- ✅ Helmet for HTTP headers
- ✅ CORS configured
- ✅ Input validation with Joi
- ✅ No business logic in frontend
- ✅ Database constraints and indexes
- ✅ Prepared statements (via Knex)

---

## Support

For issues or questions, contact the backend team.
