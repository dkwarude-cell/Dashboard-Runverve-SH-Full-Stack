import dotenv from 'dotenv';
import app from './app.js';
import { initializeDatabase, closeDatabase } from './config/db.js';
import { initializeFirebase } from './config/firebase.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * Start Server
 */
async function startServer() {
  try {
    // Initialize database
    console.log('Initializing database...');
    await initializeDatabase();

    // Initialize Firebase
    console.log('Initializing Firebase...');
    initializeFirebase();

    // Start the Express server
    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API v${process.env.API_VERSION || 'v1'} endpoints ready`);
      console.log('\n📚 API Documentation:');
      console.log(`  - Users:      http://localhost:${PORT}/api/v1/users`);
      console.log(`  - Clients:    http://localhost:${PORT}/api/v1/clients`);
      console.log(`  - Therapists: http://localhost:${PORT}/api/v1/therapists`);
      console.log(`  - Sessions:   http://localhost:${PORT}/api/v1/sessions`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\nShutting down gracefully...');
      server.close(async () => {
        await closeDatabase();
        console.log('✓ Server stopped');
        process.exit(0);
      });
    });

    process.on('SIGTERM', async () => {
      console.log('\n\nShutting down gracefully...');
      server.close(async () => {
        await closeDatabase();
        console.log('✓ Server stopped');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();
