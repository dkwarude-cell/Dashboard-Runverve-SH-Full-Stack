# 🚀 Running the Full Stack Project Locally (with Docker)

This guide documents the exact steps taken to run the SmartHeal Dashboard (Frontend, Backend, and Database) locally on your machine.

## Prerequisites

- **Node.js** (v18+ recommended)
- **Docker Desktop** (must be running in the background)
- **npm** (comes with Node.js)

---

## Step 1: Start the Database (Docker)

The backend uses PostgreSQL as its database. Instead of installing PostgreSQL natively, we run it inside a Docker container.

1. Open a new terminal.
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Install backend dependencies (if you haven't already):
   ```bash
   npm install
   ```
4. Start the database using the predefined Docker script:
   ```bash
   npm run docker:up
   ```
   _Note: This command runs `docker-compose up -d` in the background, spinning up the `smartheal_postgres` container on port 5433._

## Step 2: Start the Backend Server

Once the database container is running, you can start the Node.js API server.

1. In the same `backend` terminal, run:
   ```bash
   npm run dev
   ```
2. The server will initialize the database schema, run migrations, and start listening on `http://localhost:3000`.

_(Troubleshooting: If you started `npm run dev` before the Docker container was fully ready, it might crash with a `connect ECONNREFUSED 127.0.0.1:5433` error. Simply type `rs` and press Enter in the nodemon terminal to restart the backend once Docker is up)._

## Step 3: Start the Frontend (React Native / Expo Web)

Now that the backend API is ready, we can start the frontend dashboard.

1. Open a **second** terminal.
2. Navigate to the root directory of the project:
   ```bash
   cd Dashboard-Runverve-SH-Full-Stack
   ```
3. Install frontend dependencies:
   ```bash
   npm install
   ```
4. Start the Expo development server for the web:
   ```bash
   npm run web
   ```
5. The frontend will bundle the app and launch it. You can access the dashboard by pressing `w` in the terminal or opening your browser to `http://localhost:8081`.

---

## Shutting Down

When you are done developing, you can cleanly shut everything down:

1. **Frontend:** Press `Ctrl + C` in the root terminal.
2. **Backend:** Press `Ctrl + C` in the backend terminal.
3. **Database (Docker):** Stop the PostgreSQL container by running this in the backend folder:
   ```bash
   npm run docker:down
   ```
