# SETUP CHECKLIST

Complete these steps to get the backend production-ready.

## Prerequisites

- [ ] Node.js 16+ installed
- [ ] npm 8+ installed
- [ ] Docker installed
- [ ] Firebase project created
- [ ] PostgreSQL knowledge (optional)

## Initial Setup

### 1. Firebase Configuration

- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Create new project or select existing
- [ ] Generate Service Account key:
  - Project Settings → Service Accounts → Generate new private key
  - Save the JSON file
- [ ] Copy these values to `.env`:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_PRIVATE_KEY` (with newlines as `\n`)
  - `FIREBASE_CLIENT_EMAIL`

### 2. Environment Setup

- [ ] Copy `.env.example` to `.env`
- [ ] Update with Firebase credentials
- [ ] Set secure `DB_PASSWORD` for production
- [ ] Update `CORS_ORIGIN` with frontend URLs

### 3. Database Setup

- [ ] Run `npm run docker:up`
- [ ] Verify PostgreSQL running: `npm run docker:logs`
- [ ] Connection test: `npm run migrate:latest`

### 4. Run Server

- [ ] `npm install`
- [ ] `npm run dev`
- [ ] Test health endpoint: `curl http://localhost:3000/health`

## Essential Endpoints to Test

### Users

- [ ] `GET /api/v1/users/profile`
- [ ] `PUT /api/v1/users/profile`
- [ ] `GET /api/v1/users` (admin)

### Clients

- [ ] `POST /api/v1/clients` (create client)
- [ ] `GET /api/v1/clients/my-profile`
- [ ] `GET /api/v1/clients/:clientId/progress`
- [ ] `GET /api/v1/clients/:clientId/risk-score`

### Therapists

- [ ] `GET /api/v1/therapists/ranked`
- [ ] `GET /api/v1/therapists/specializations`
- [ ] `POST /api/v1/therapists/:therapistId/review`

### Sessions

- [ ] `POST /api/v1/sessions` (create)
- [ ] `GET /api/v1/sessions/:sessionId`
- [ ] `PUT /api/v1/sessions/:sessionId/complete`
- [ ] `GET /api/v1/sessions/stats`

## API Documentation

- [ ] Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- [ ] Test all endpoints with Postman
- [ ] Verify authentication flow
- [ ] Verify RBAC enforcement

## Database

### Migrations

- [ ] Run latest migrations: `npm run migrate:latest`
- [ ] Test rollback: `npm run migrate:rollback`
- [ ] Run again: `npm run migrate:latest`
- [ ] Connect to DB and explore schema:
  ```bash
  docker exec -it smartheal_postgres psql -U postgres -d smartheal_db
  ```

### Schema Verification

- [ ] Users table created
- [ ] Clients table created with FK to users
- [ ] Therapists table created with FK to users
- [ ] Sessions table created with FKs
- [ ] Analytics table created
- [ ] All indexes created
- [ ] Foreign keys enforced

## Business Logic Verification

### Risk Scoring

- [ ] Create client ✓
- [ ] Trigger score calculation
- [ ] Verify score between 0-100
- [ ] Test calculation endpoint

### Therapist Ranking

- [ ] Create multiple therapists
- [ ] Add ratings to some
- [ ] Test ranked endpoint
- [ ] Verify ranking algorithm

### Session Completion

- [ ] Create session
- [ ] Complete with metrics
- [ ] Verify client counters updated
- [ ] Verify therapist rating updated
- [ ] Verify risk score recorded

## Security

- [ ] Firebase token validation working
- [ ] RBAC enforced on protected routes
- [ ] Non-admin users cannot access admin endpoints
- [ ] CORS headers set correctly
- [ ] No sensitive data in logs
- [ ] Input validation working (Joi)

## Error Handling

- [ ] Test 401 (no auth)
- [ ] Test 403 (insufficient permissions)
- [ ] Test 404 (not found)
- [ ] Test 400 (validation error)
- [ ] Test 500 (server error handling)

## Logging & Monitoring

- [ ] Morgan logging active
- [ ] Error logs captured
- [ ] Check logs don't contain sensitive data
- [ ] Performance metrics tracked

## Frontend Integration

- [ ] Frontend retrieves Firebase token ✓
- [ ] Frontend sends token in Authorization header ✓
- [ ] Frontend handles 401 (redirect to login)
- [ ] Frontend handles 403 (show error)
- [ ] Frontend displays API errors properly

## Production Preparation

- [ ] Use production Firebase project
- [ ] Use managed PostgreSQL (RDS, Cloud SQL)
- [ ] Enable SSL for database
- [ ] Set HTTPS on Express
- [ ] Configure rate limiting
- [ ] Setup backup strategy
- [ ] Setup monitoring/alerts
- [ ] Configure logging service
- [ ] Review security headers
- [ ] Test with production data

## Deployment

- [ ] Deploy to target environment
- [ ] Run migrations on production
- [ ] Test health endpoint
- [ ] Test core endpoints
- [ ] Monitor logs for errors
- [ ] Load test if needed

## Documentation

- [ ] API docs complete
- [ ] README updated
- [ ] Setup instructions clear
- [ ] Troubleshooting guide prepared
- [ ] Architecture documented
- [ ] Team onboarded

## Sign-Off

- [ ] Backend ready for production
- [ ] Frontend ready for integration
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Team confident in deployment

---

For questions or blockers, refer to [README.md](./README.md) or [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
