/**
 * Seed file for dummy data
 * Creates realistic test data for clients, therapists, sessions, and analytics
 * Run: npm run seed
 */

import { v4 as uuidv4 } from 'uuid';

export async function seed(knex) {
  // Clear existing data
  await knex('analytics').del();
  await knex('sessions').del();
  await knex('therapists').del();
  await knex('clients').del();
  await knex('users').del();

  console.log('🗑️  Cleared existing data');

  // ============================================================
  // 1. CREATE ADMIN USER
  // ============================================================
  const adminId = 'admin-' + uuidv4();
  await knex('users').insert({
    id: adminId,
    firebase_uid: 'admin-firebase-uid',
    role: 'admin',
    email: 'admin@smartheal.com',
    first_name: 'Admin',
    last_name: 'User',
    phone_number: '+1-555-0000',
    is_active: true,
  });

  console.log('✓ Admin user created');

  // ============================================================
  // 2. CREATE THERAPISTS (Doctors)
  // ============================================================
  const therapistIds = [];
  const therapists = [
    {
      name: { first: 'Dr. Sarah', last: 'Williams' },
      email: 'sarah.williams@smartheal.com',
      firebaseUid: 'therapist-sarah-001',
      license: 'LN001-CA-2020',
      specialization: 'Cognitive Behavioral Therapy',
      experience: 8,
    },
    {
      name: { first: 'Dr. Michael', last: 'Chen' },
      email: 'michael.chen@smartheal.com',
      firebaseUid: 'therapist-michael-001',
      license: 'LN002-NY-2019',
      specialization: 'Trauma & PTSD',
      experience: 12,
    },
    {
      name: { first: 'Dr. Jennifer', last: 'Martinez' },
      email: 'jennifer.martinez@smartheal.com',
      firebaseUid: 'therapist-jennifer-001',
      license: 'LN003-TX-2021',
      specialization: 'Depression & Anxiety',
      experience: 6,
    },
    {
      name: { first: 'Dr. David', last: 'Anderson' },
      email: 'david.anderson@smartheal.com',
      firebaseUid: 'therapist-david-001',
      license: 'LN004-FL-2018',
      specialization: 'Family Therapy',
      experience: 14,
    },
  ];

  for (const therapist of therapists) {
    const userId = 'therapist-' + uuidv4();
    const therapistId = 'th-' + uuidv4();

    // Create user
    await knex('users').insert({
      id: userId,
      firebase_uid: therapist.firebaseUid,
      role: 'therapist',
      email: therapist.email,
      first_name: therapist.name.first,
      last_name: therapist.name.last,
      phone_number: `+1-555-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')}`,
      is_active: true,
    });

    // Create therapist profile
    await knex('therapists').insert({
      id: therapistId,
      user_id: userId,
      license_number: therapist.license,
      specialization: therapist.specialization,
      certifications: JSON.stringify([
        'American Psychological Association (APA)',
        'National Board for Certified Counselors (NBCC)',
      ]),
      years_of_experience: therapist.experience,
      average_rating: (Math.random() * 1 + 4).toFixed(2), // 4.0 - 5.0
      total_reviews: Math.floor(Math.random() * 50) + 20,
      total_sessions: Math.floor(Math.random() * 200) + 50,
      available_hours: JSON.stringify({
        monday: [9, 10, 14, 15, 16],
        tuesday: [10, 11, 14, 15],
        wednesday: [9, 10, 14, 15, 16],
        thursday: [10, 11, 15, 16],
        friday: [9, 10, 11, 14, 15],
      }),
      accepting_new_clients: Math.random() > 0.3,
      max_clients: 25,
      current_clients: Math.floor(Math.random() * 20) + 5,
    });

    therapistIds.push({ id: therapistId, name: `${therapist.name.first} ${therapist.name.last}` });
  }

  console.log(`✓ Created ${therapists.length} therapists`);

  // ============================================================
  // 3. CREATE CLIENTS
  // ============================================================
  const clientIds = [];
  const clientNames = [
    { first: 'John', last: 'Smith' },
    { first: 'Emily', last: 'Johnson' },
    { first: 'Robert', last: 'Brown' },
    { first: 'Jessica', last: 'Davis' },
    { first: 'Michael', last: 'Wilson' },
    { first: 'Sarah', last: 'Moore' },
    { first: 'James', last: 'Taylor' },
    { first: 'Lisa', last: 'Anderson' },
    { first: 'William', last: 'Thomas' },
    { first: 'Mary', last: 'Jackson' },
    { first: 'David', last: 'White' },
    { first: 'Patricia', last: 'Harris' },
  ];

  const diagnoses = [
    'Major Depressive Disorder',
    'Generalized Anxiety Disorder',
    'Post-Traumatic Stress Disorder',
    'Bipolar Disorder',
    'Obsessive-Compulsive Disorder',
    'Social Anxiety Disorder',
  ];

  for (let i = 0; i < clientNames.length; i++) {
    const client = clientNames[i];
    const userId = 'client-' + uuidv4();
    const clientId = 'cl-' + uuidv4();
    const diagnosis = diagnoses[i % diagnoses.length];

    // Create user
    await knex('users').insert({
      id: userId,
      firebase_uid: `client-firebase-${i}`,
      role: 'client',
      email: `${client.first.toLowerCase()}.${client.last.toLowerCase()}@email.com`,
      first_name: client.first,
      last_name: client.last,
      phone_number: `+1-555-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')}`,
      is_active: true,
    });

    // Create client profile
    const totalSessions = Math.floor(Math.random() * 30) + 5;
    const completedSessions = Math.floor(totalSessions * (Math.random() * 0.4 + 0.5));
    const riskScore = calculateRiskScore(completedSessions, totalSessions);

    await knex('clients').insert({
      id: clientId,
      user_id: userId,
      diagnosis: diagnosis,
      medical_history: generateMedicalHistory(),
      emergency_contact_name: generateEmergencyContact(),
      emergency_contact_phone: `+1-555-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')}`,
      session_preference: ['weekly', 'biweekly', 'monthly'][Math.floor(Math.random() * 3)],
      session_duration_minutes: 60,
      timezone: 'America/New_York',
      total_sessions: totalSessions,
      completed_sessions: completedSessions,
      last_session_date: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
      risk_score: riskScore,
    });

    clientIds.push({ id: clientId, name: `${client.first} ${client.last}` });
  }

  console.log(`✓ Created ${clientNames.length} clients`);

  // ============================================================
  // 4. CREATE SESSIONS
  // ============================================================
  const sessionStatuses = ['completed', 'scheduled', 'in_progress', 'cancelled', 'no_show'];
  let totalSessionsCreated = 0;

  for (const client of clientIds) {
    const numSessions = Math.floor(Math.random() * 8) + 3;
    const assignedTherapist = therapistIds[Math.floor(Math.random() * therapistIds.length)];

    for (let i = 0; i < numSessions; i++) {
      const status = sessionStatuses[Math.floor(Math.random() * sessionStatuses.length)];
      const daysAgo = Math.floor(Math.random() * 90);
      const sessionDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      const sessionData = {
        id: 'sess-' + uuidv4(),
        client_id: client.id,
        therapist_id: assignedTherapist.id,
        status: status,
        session_datetime: sessionDate,
        duration_minutes: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
        notes: generateSessionNotes(),
        client_rating: status === 'completed' ? (Math.random() * 2 + 3).toFixed(1) : null,
        client_feedback: generateClientFeedback(),
        session_data: JSON.stringify({
          topics: generateSessionTopics(),
          techniques: generateTechniques(),
          homework: generateHomework(),
        }),
        risk_score_before: (Math.random() * 4 + 2).toFixed(2),
        risk_score_after: (Math.random() * 4 + 1).toFixed(2),
        progress_category: ['improved', 'stable', 'declined'][Math.floor(Math.random() * 3)],
        progress_notes: generateProgressNotes(),
      };

      await knex('sessions').insert(sessionData);
      totalSessionsCreated++;
    }
  }

  console.log(`✓ Created ${totalSessionsCreated} sessions`);

  // ============================================================
  // 5. CREATE ANALYTICS DATA
  // ============================================================
  let analyticsCreated = 0;

  // Get all users for analytics
  const allUsers = await knex('users').select('id');

  for (const user of allUsers) {
    // Session completion analytics
    await knex('analytics').insert({
      id: 'ana-' + uuidv4(),
      user_id: user.id,
      metric_type: 'sessions_completed',
      metric_value: Math.floor(Math.random() * 30) + 5,
      metadata: JSON.stringify({ period: 'monthly' }),
      metric_date: new Date(),
    });

    // Satisfaction score
    await knex('analytics').insert({
      id: 'ana-' + uuidv4(),
      user_id: user.id,
      metric_type: 'satisfaction_score',
      metric_value: (Math.random() + 3.5).toFixed(2),
      metadata: JSON.stringify({ scale: 5 }),
      metric_date: new Date(),
    });

    // Risk trend
    await knex('analytics').insert({
      id: 'ana-' + uuidv4(),
      user_id: user.id,
      metric_type: 'risk_trend',
      metric_value: (Math.random() * 2 - 1).toFixed(2), // -1 to +1
      metadata: JSON.stringify({ direction: Math.random() > 0.5 ? 'improvement' : 'decline' }),
      metric_date: new Date(),
    });

    // Session adherence
    await knex('analytics').insert({
      id: 'ana-' + uuidv4(),
      user_id: user.id,
      metric_type: 'session_adherence',
      metric_value: (Math.random() * 40 + 60).toFixed(2), // 60-100%
      metadata: JSON.stringify({ unit: 'percentage' }),
      metric_date: new Date(),
    });

    analyticsCreated += 4;
  }

  console.log(`✓ Created ${analyticsCreated} analytics records`);

  console.log('\n✨ Seeding completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - Therapists: ${therapists.length}`);
  console.log(`   - Clients: ${clientNames.length}`);
  console.log(`   - Sessions: ${totalSessionsCreated}`);
  console.log(`   - Analytics Records: ${analyticsCreated}`);
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function calculateRiskScore(completed, total) {
  const adherence = completed / total;
  let baseScore = 5;

  if (adherence < 0.5) baseScore -= 1.5;
  else if (adherence < 0.7) baseScore -= 0.5;
  else baseScore -= 0.2;

  const variance = Math.random() * 1;
  return Math.max(1, Math.min(5, baseScore + variance)).toFixed(2);
}

function generateMedicalHistory() {
  const histories = [
    'Family history of anxiety disorders. First episode 2 years ago.',
    'Previous therapy in 2020. Not currently on medication.',
    'Sleep disturbances since job loss. Recent stressful life event.',
    'Long-term management of chronic condition. Recently diagnosed.',
    'History of substance use, 3 years sober. Strong support network.',
  ];
  return histories[Math.floor(Math.random() * histories.length)];
}

function generateEmergencyContact() {
  const firstNames = ['Mary', 'John', 'Robert', 'Jennifer', 'Michael', 'Lisa'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function generateSessionNotes() {
  const notes = [
    'Client discussed recent work stress. Practiced breathing techniques.',
    'Deep work on childhood trauma. Good progress with exposure work.',
    'Reviewed homework assignments. Client very engaged.',
    'Discussed relationship patterns. Introduced new coping strategies.',
    'Brief session - client unwell but preferred to continue.',
  ];
  return notes[Math.floor(Math.random() * notes.length)];
}

function generateClientFeedback() {
  const feedbacks = [
    'Very helpful session. Learned new techniques.',
    'Good progress. Feel more confident.',
    'Therapist was empathetic and understanding.',
    'Session was productive. Will practice techniques daily.',
    'Felt heard and supported. Thank you.',
  ];
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function generateSessionTopics() {
  const topics = ['anxiety', 'depression', 'relationships', 'work stress', 'family issues', 'self-esteem'];
  return topics.slice(0, Math.floor(Math.random() * 3) + 1);
}

function generateTechniques() {
  const techniques = [
    'CBT',
    'Deep breathing',
    'Mindfulness',
    'Exposure therapy',
    'Cognitive reframing',
    'Journaling',
  ];
  return techniques.slice(0, Math.floor(Math.random() * 3) + 1);
}

function generateHomework() {
  const homework = [
    'Practice breathing exercises twice daily',
    'Journal thoughts for 15 minutes daily',
    'Read chapter 3 of workbook',
    'Try one new social interaction',
    'Meditation for 10 minutes daily',
  ];
  return homework[Math.floor(Math.random() * homework.length)];
}

function generateProgressNotes() {
  const notes = [
    'Client showing good engagement with treatment plan.',
    'Slight improvement in mood. Continue current approach.',
    'Risk level stable. Monitor for any acute symptoms.',
    'Strong progress on identified goals.',
    'Some resistance to homework. Discussed barriers.',
  ];
  return notes[Math.floor(Math.random() * notes.length)];
}
