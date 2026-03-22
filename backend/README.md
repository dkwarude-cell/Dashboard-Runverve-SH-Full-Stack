# SmartHeal Backend

Production-grade backend for SmartHeal React Native application.

## 🏗️ Architecture

```
src/
├── config/          # Configuration (Database, Firebase)
├── routes/          # API Routes
├── controllers/      # Request handlers
├── services/        # Business logic (SINGLE SOURCE OF TRUTH)
├── middleware/      # Auth, RBAC, error handling
├── models/          # Database models (optional, using migrations)
├── migrations/      # Schema changes (Knex)
├── utils/           # Utilities
├── app.js           # Express setup
└── server.js        # Server entry point
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

```bash
# Copy example to .env
cp .env.example .env

# Edit .env with your values:
# - Database credentials (or use defaults for local Docker)
# - Firebase config (get from Firebase Console)
```

### 3. Start PostgreSQL (Docker)

```bash
npm run docker:up
```

Verify PostgreSQL is running:

```bash
npm run docker:logs
```

### 4. Run Database Migrations

```bash
npm run migrate:latest
```

### 5. Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: **http://localhost:3000**

---

## 📚 API Documentation

Full API documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick API Examples

**Get User Profile**

```bash
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer <firebase_token>"
```

**Create Client Profile**

```bash
curl -X POST http://localhost:3000/api/v1/clients \
  -H "Authorization: Bearer <firebase_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "diagnosis": "depression",
    "medical_history": "...",
    "emergency_contact_name": "John",
    "emergency_contact_phone": "+1234567890"
  }'
```

**Get Ranked Therapists**

```bash
curl -X GET http://localhost:3000/api/v1/therapists/ranked?specialization=Depression \
  -H "Authorization: Bearer <firebase_token>"
```

---

## 🔐 Authentication Flow

1. **Frontend**: User logs in with Firebase
2. **Firebase**: Issues JWT token
3. **Frontend**: Sends token in Authorization header: `Bearer <token>`
4. **Backend**:
   - Verifies token with Firebase Admin SDK
   - Resolves user from database
   - Enforces role-based access control
   - Attaches user to request

All protected endpoints require: `Authorization: Bearer <firebase_id_token>`

---

## 👥 User Roles

| Role          | Permissions                                            |
| ------------- | ------------------------------------------------------ |
| **admin**     | Full access, manage users, update roles, view all data |
| **therapist** | Create/manage sessions, view clients, update profile   |
| **support**   | View dashboard, analytics, user support                |
| **client**    | Book sessions, view progress, update profile           |

---

## 🔧 Core Components

### Config Files

**`src/config/db.js`**

- Database connection (PostgreSQL)
- Uses Knex for migrations and queries
- Connection pooling configured

**`src/config/firebase.js`**

- Firebase Admin SDK initialization
- JWT token verification
- User lookup from Firebase

### Middleware

**`src/middleware/auth.js`**

- `verifyFirebaseJWT`: Validates Firebase token, resolves user

**`src/middleware/rbac.js`**

- `requireRole()`: Check allowed roles
- `requireAdminRole()`: Admin-only access
- `requireTherapistRole()`: Therapist-only access
- `requireClientRole()`: Client-only access

**`src/middleware/errorHandler.js`**

- Centralized error handling
- Standard error response format
- 404 handler

### Services (Business Logic)

**`src/services/userService.js`**

- User CRUD operations
- Role management
- Profile updates

**`src/services/clientService.js`**

- Client profile management
- **Risk scoring algorithm** (backend only)
- Progress tracking
- Session analytics

**`src/services/therapistService.js`**

- Therapist profile management
- **Therapist ranking algorithm** (backend only)
- Review management
- Availability tracking

**`src/services/sessionService.js`**

- Session creation and management
- Session completion with metrics
- Session statistics
- Status tracking

### Controllers

Thin layers that:

1. Validate input (Joi validation)
2. Call service methods
3. Return formatted responses

One controller per service.

### Routes

REST endpoints with:

- Authentication middleware
- RBAC enforcement
- Controller invocation

---

## 💾 Database Migrations

### View Migrations

```bash
ls src/migrations/
```

Current migrations:

1. `001_create_users_table` - Core users with roles
2. `002_create_clients_table` - Client profiles
3. `003_create_therapists_table` - Therapist profiles
4. `004_create_sessions_table` - Therapy sessions
5. `005_create_analytics_table` - Analytics tracking

### Create New Migration

```bash
npm run migrate:make create_new_table_name
```

Then edit the file in `src/migrations/`.

### Run Migrations

```bash
# Latest
npm run migrate:latest

# Rollback last migration
npm run migrate:rollback

# Rollback all
npm run migrate:rollback --all
```

---

## 🧪 Testing APIs

### Using cURL

```bash
# Health check (no auth required)
curl http://localhost:3000/health

# Get user profile
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

### Using Postman

1. Import requests from API_DOCUMENTATION.md
2. Set `Authorization` header with Bearer token
3. Test endpoints

### Using Thunder Client / REST Client

VS Code extension "REST Client" - Create `.http` file:

```http
### Get User Profile
GET http://localhost:3000/api/v1/users/profile
Authorization: Bearer YOUR_FIREBASE_TOKEN

### Create Client
POST http://localhost:3000/api/v1/clients
Authorization: Bearer YOUR_FIREBASE_TOKEN
Content-Type: application/json

{
  "diagnosis": "depression",
  "medical_history": "...",
  "emergency_contact_name": "Jane",
  "emergency_contact_phone": "+1234567890"
}
```

---

## 🐛 Debugging

### Enable Detailed Logging

Set `LOG_LEVEL` in `.env`:

```
LOG_LEVEL=debug
```

### View Database Logs

```bash
npm run docker:logs
```

### Database Shell

```bash
docker exec -it smartheal_postgres psql -U postgres -d smartheal_db
```

### Common Issues

**Database Connection Failed**

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

Solution: Run `npm run docker:up`

**Migration Error**

```
Error: Unknown migration
```

Solution: Check migration files exist in `src/migrations/`

**Firebase Token Invalid**

```
Error: Firebase token verification failed
```

Solution:

- Ensure Firebase credentials are set in `.env`
- Token must be from same Firebase project
- Token must not be expired

**CORS Error**

```
Cross-Origin Request Blocked
```

Solution: Add frontend URL to `CORS_ORIGIN` in `.env`

---

## 📊 Business Logic (Backend Only)

All business logic is implemented in services, NOT in frontend:

### Risk Score Calculation

- Base: 50
- Formula: `-2 per session + improvement bonus`
- Location: `clientService.js::calculateRiskScore()`

### Therapist Ranking

- Considers: rating (40%), experience (30%), availability (30%)
- Only active therapists with availability
- Location: `therapistService.js::getRankedTherapists()`

### Session Completion Logic

- Increments client counters
- Updates therapist metrics
- Records risk changes
- Calculates progress
- Location: `sessionService.js::completeSession()`

---

## 🚢 Deployment

### Environment for Production

```bash
NODE_ENV=production
PORT=3000
DB_HOST=prod-db.example.com
DB_PORT=5432
DB_NAME=smartheal_prod
DB_USER=prod_user
DB_PASSWORD=secure_password_here
FIREBASE_PROJECT_ID=prod-project-id
FIREBASE_PRIVATE_KEY=prod-private-key
FIREBASE_CLIENT_EMAIL=prod-firebase@prod.iam.gserviceaccount.com
API_VERSION=v1
CORS_ORIGIN=https://app.example.com,https://web.example.com
```

### Database

- Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
- Enable backups
- Set SSL mode to require
- Configure connection pooling

### Server

- Deploy on Node.js hosting (Heroku, AWS ECS, Google Cloud Run)
- Setup reverse proxy (nginx)
- Enable HTTPS
- Configure logging/monitoring
- Setup health checks

### Pre-deployment Checklist

- [ ] All migrations tested
- [ ] Environment variables configured
- [ ] Database backup strategy
- [ ] CORS properly configured
- [ ] HTTPS enabled
- [ ] Logging/monitoring setup
- [ ] Rate limiting configured
- [ ] Secrets management in place

---

## 📞 Support & Contributing

### Project Structure Philosophy

- **No Business Logic in Frontend**: All complex logic (risk scoring, ranking, analytics) is in services
- **Services Are Single Source of Truth**: Controllers validate, services implement
- **Clean Separation**: Routes → Controllers → Services → Database
- **Type Safety**: Joi validation on all inputs
- **Error Handling**: Centralized, consistent response format

### File Naming Conventions

- Services: `[resource]Service.js`
- Controllers: `[resource]Controller.js`
- Routes: `[resource]Routes.js`
- Migrations: `[number]_[description].js`

### Adding New Feature

1. **Create migration** for new table/columns
2. **Implement service** with business logic
3. **Create controller** for validation/response
4. **Add routes** with auth/RBAC
5. **Update API_DOCUMENTATION.md**
6. **Test with curl/Postman**

---

## 📄 License

MIT

---

## 🔗 Links

- [API Documentation](./API_DOCUMENTATION.md)
- [Firebase Console](https://console.firebase.google.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Knex.js Docs](http://knexjs.org/)
- [Express Docs](https://expressjs.com/)
