# 🚀 COMPLETE SETUP GUIDE (Without Firebase)

## ⚠️ Important: Start Docker First

### Windows

1. **Open Docker Desktop** - Look for "Docker" app in your Start menu
2. Wait for it to fully start (status will show in system tray)
3. Then proceed with commands below

### Mac

```bash
open /Applications/Docker.app
```

### Linux

```bash
sudo systemctl start docker
```

---

## 📋 Setup Steps

### Step 1: Backend Setup (Run These Commands)

```bash
# Navigate to backend
cd backend

# Environment file already created ✓
# Check: cat .env (to verify values)

# Start PostgreSQL (requires Docker running)
npm run docker:up

# Wait 10 seconds for DB to be ready, then run:
npm run migrate:latest

# Start backend server
npm run dev
```

**Expected Output**:

```
✓ Database connected successfully
✓ Server running on http://localhost:3000
✓ API v1 endpoints ready
```

---

### Step 2: Frontend Setup (Run in New Terminal)

```bash
# Navigate to frontend
cd ../  # Go back to root

# Dependencies already installed ✓
npm start

# Follow Expo prompts to run on:
# - Web (press 'w')
# - Android emulator (press 'a')
# - iOS simulator (press 'i')
# - Scan QR with Expo Go app
```

**Expected Output**:

```
✓ Expo server running on http://localhost:19000
```

---

## ✅ Verification Checklist

### Backend Running?

Test in new terminal (while backend is running):

```bash
curl http://localhost:3000/health
```

Should see:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-03-22T..."
}
```

### Database Connected?

```bash
# View backend logs - you should see ✓ Database connected
```

### Migrations Applied?

```bash
# From backend folder:
docker exec -it smartheal_postgres psql -U postgres -d smartheal_db -c "\dt"
```

Should show 5 tables: users, clients, therapists, sessions, analytics

---

## 📁 Current State

### Backend ✓

- [x] npm modules installed
- [x] .env created with defaults
- [x] Docker compose configured
- [ ] Docker container started (requires Docker Desktop running)
- [ ] Migrations applied
- [ ] Server running

### Frontend ✓

- [x] npm modules installed
- [x] Project structure ready
- [ ] Running on Expo

---

## 🎯 Next: Connect Frontend to Backend

### 1. Find Backend URL

While backend is running:

```bash
# Backend's actual accessible URL
http://localhost:3000/api/v1
```

### 2. Update Frontend Configuration

Edit: `lib/supabase.ts` or create new API config file:

```typescript
export const API_BASE_URL = "http://localhost:3000/api/v1";

export const apiCall = async (endpoint: string, options?: any) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      // No Authorization header needed (Firebase disabled)
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};
```

### 3. Test Connection

```typescript
// In any React component
import { apiCall } from "@/lib/supabase";

// Test call
const health = await apiCall("/health").catch((err) => console.error(err));
console.log(health);
```

---

## 🔧 Common Issues

### "Docker daemon not running"

**Solution**: Start Docker Desktop app

### "Cannot connect to database"

**Solution**:

1. Check Docker is running: `docker ps`
2. Wait 10 seconds for PostgreSQL to start
3. Check logs: `npm run docker:logs`

### "Migrations failed"

**Solution**:

```bash
# Rollback and retry
npm run migrate:rollback --all
npm run migrate:latest
```

### "Port 3000 already in use"

**Solution**:

```bash
# Kill process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

---

## 📚 Available Endpoints (No Auth Required)

```bash
# Health check
curl http://localhost:3000/health

# Get all users (no auth)
curl http://localhost:3000/api/v1/users

# Get all therapists
curl http://localhost:3000/api/v1/therapists

# Get all clients
curl http://localhost:3000/api/v1/clients

# Get all sessions
curl http://localhost:3000/api/v1/sessions
```

---

## 💾 Database Commands

### Check DB Status

```bash
docker ps  # See if smartheal_postgres is running
```

### Connect to Database

```bash
docker exec -it smartheal_postgres psql -U postgres -d smartheal_db
```

### View Tables

```sql
\dt
\d users
\d clients
SELECT COUNT(*) FROM users;
```

### Stop Database

```bash
npm run docker:down
```

### View Logs

```bash
npm run docker:logs
```

---

## 🎮 Test API in Postman

1. **Import into Postman**:
   - Open Postman
   - Import from URL: (or copy requests)

2. **Test Endpoints**:

   ```
   GET http://localhost:3000/api/v1/users
   GET http://localhost:3000/api/v1/therapists/ranked
   POST http://localhost:3000/api/v1/clients
   ```

3. **No Authorization Header Needed** (Firebase disabled)

---

## 🚢 Terminal Layout (Recommended)

Keep 3-4 terminals open:

**Terminal 1: Backend**

```bash
cd backend
npm run docker:up  # Keep running
# Then in new terminal:
npm run migrate:latest
npm run dev        # Keep running
```

**Terminal 2: Frontend**

```bash
npm start          # Keep running
```

**Terminal 3: Testing/Debug**

```bash
# Use for curl commands, psql, etc.
curl http://localhost:3000/health
```

---

## ✨ You Should See

### Backend Terminal

```
✓ Database connected successfully
✓ Server running on http://localhost:3000
✓ API v1 endpoints ready

  - Users:      http://localhost:3000/api/v1/users
  - Clients:    http://localhost:3000/api/v1/clients
  - Therapists: http://localhost:3000/api/v1/therapists
  - Sessions:   http://localhost:3000/api/v1/sessions
```

### Frontend Terminal

```
✓ Expo server running on http://localhost:19000
```

### Curl Test

```bash
$ curl http://localhost:3000/health
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-03-22T..."
}
```

---

## 🎯 What's Working

✅ Backend Express server (when running)
✅ PostgreSQL Docker setup (when Docker running)
✅ Database migrations (5 tables)
✅ 27 API endpoints (+ health check)
✅ Frontend React Native app
✅ Navigation structure
✅ UI components

❌ Firebase Auth (intentionally disabled)
❌ JWT verification (intentionally disabled for now)

---

## 📞 Next Steps After Running

1. **Verify backend**: `curl http://localhost:3000/health`
2. **Check database**: `docker exec -it smartheal_postgres psql -U postgres -d smartheal_db -c "\dt"`
3. **Test endpoints**: Use curl or Postman
4. **Connect frontend**: Update API URL in frontend code
5. **Test frontend-backend**: Call API from React Native app

---

## 🔑 Key Files

| File                           | Purpose                 |
| ------------------------------ | ----------------------- |
| `backend/.env`                 | Backend configuration   |
| `backend/docker-compose.yml`   | PostgreSQL Docker setup |
| `backend/src/migrations/`      | Database schemas        |
| `backend/src/services/`        | Business logic          |
| `backend/API_DOCUMENTATION.md` | All endpoints           |
| `backend/README.md`            | Detailed docs           |

---

## ⏭️ When Ready to Add Firebase

1. Get Firebase credentials from Firebase Console
2. Add to `backend/.env`:
   - FIREBASE_PROJECT_ID
   - FIREBASE_PRIVATE_KEY
   - FIREBASE_CLIENT_EMAIL
3. Update frontend with Firebase config
4. Add JWT token to API requests: `Authorization: Bearer <token>`

---

**Ready? Start with:**

```bash
# Terminal 1
cd backend && npm run docker:up

# (Wait for Docker to start, then new terminal)
cd backend && npm run migrate:latest && npm run dev

# Terminal 2
npm start
```

Let me know when you've started Docker! 🚀
