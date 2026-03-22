#!/usr/bin/env node

/**
 * Seed Runner
 * Standalone script to populate database with dummy data
 * Usage: npm run seed:data
 */

import dotenv from 'dotenv';
import { db } from '../src/config/db.js';
import { seed } from '../src/seeds/seed-dummy-data.js';

dotenv.config();

async function runSeed() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Run the seed
    await seed(db);

    console.log('\n✨ Seed completed successfully!');
    console.log('\n📊 You can now:');
    console.log('   - Query the API at http://localhost:3000/api/v1/analytics/dashboard');
    console.log('   - View client data at http://localhost:3000/api/v1/clients');
    console.log('   - View therapist data at http://localhost:3000/api/v1/therapists');
    console.log('   - View sessions at http://localhost:3000/api/v1/sessions');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the seed
runSeed();
