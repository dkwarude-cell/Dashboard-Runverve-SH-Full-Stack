import { db } from '../config/db.js';

/**
 * Client Service
 * Handles all client-related business logic
 */

/**
 * Create client profile
 */
export const createClientProfile = async (userId, clientData) => {
  try {
    const newClient = {
      user_id: userId,
      diagnosis: clientData.diagnosis,
      medical_history: clientData.medical_history,
      emergency_contact_name: clientData.emergency_contact_name,
      emergency_contact_phone: clientData.emergency_contact_phone,
      session_preference: clientData.session_preference || 'weekly',
      session_duration_minutes: clientData.session_duration_minutes || 60,
      timezone: clientData.timezone || 'UTC',
    };

    const [clientId] = await db('clients').insert(newClient).returning('id');
    return getClientById(clientId);
  } catch (error) {
    throw new Error(`Failed to create client profile: ${error.message}`);
  }
};

/**
 * Get client by ID with user info
 */
export const getClientById = async (clientId) => {
  try {
    const client = await db('clients')
      .join('users', 'clients.user_id', 'users.id')
      .where('clients.id', clientId)
      .select('clients.*', 'users.email', 'users.first_name', 'users.last_name', 'users.phone_number')
      .first();

    if (!client) {
      throw new Error('Client not found');
    }

    // Add combined name field for frontend compatibility
    return {
      ...client,
      name: `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown Client',
    };
  } catch (error) {
    throw new Error(`Failed to get client: ${error.message}`);
  }
};

/**
 * Get client by user ID
 */
export const getClientByUserId = async (userId) => {
  try {
    const client = await db('clients')
      .join('users', 'clients.user_id', 'users.id')
      .where('clients.user_id', userId)
      .select('clients.*', 'users.email', 'users.first_name', 'users.last_name')
      .first();

    if (!client) {
      throw new Error('Client profile not found');
    }

    // Add combined name field for frontend compatibility
    return {
      ...client,
      name: `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown Client',
    };
  } catch (error) {
    throw new Error(`Failed to get client: ${error.message}`);
  }
};

/**
 * Update client profile
 */
export const updateClientProfile = async (clientId, updateData) => {
  try {
    const allowedFields = [
      'diagnosis',
      'medical_history',
      'emergency_contact_name',
      'emergency_contact_phone',
      'session_preference',
      'session_duration_minutes',
      'timezone',
    ];

    const filteredData = Object.keys(updateData)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    filteredData.updated_at = new Date();

    await db('clients').where('id', clientId).update(filteredData);
    return getClientById(clientId);
  } catch (error) {
    throw new Error(`Failed to update client profile: ${error.message}`);
  }
};

/**
 * Calculate risk score based on sessions and progress
 * Business Logic: Risk Scoring (moved from frontend to backend)
 */
export const calculateRiskScore = async (clientId) => {
  try {
    const client = await db('clients').where('id', clientId).first();
    const sessions = await db('sessions')
      .where('client_id', clientId)
      .where('status', 'completed')
      .orderBy('created_at', 'desc')
      .limit(10);

    // Risk scoring algorithm
    let riskScore = 50; // Base score

    // Reduce risk based on session completion
    if (sessions.length > 0) {
      riskScore -= sessions.length * 2;
    }

    // Check for improvement trend
    const recentSessions = sessions.slice(0, 3);
    if (recentSessions.length >= 3) {
      const avgBefore = recentSessions.reduce((sum, s) => sum + (s.risk_score_before || 0), 0) / recentSessions.length;
      const avgAfter = recentSessions.reduce((sum, s) => sum + (s.risk_score_after || 0), 0) / recentSessions.length;

      if (avgAfter < avgBefore) {
        riskScore -= 10; // Improvement trend
      }
    }

    // Clamp between 0-100
    riskScore = Math.max(0, Math.min(100, riskScore));

    // Update client risk score
    await db('clients').where('id', clientId).update({
      risk_score: riskScore,
      updated_at: new Date(),
    });

    return riskScore;
  } catch (error) {
    throw new Error(`Failed to calculate risk score: ${error.message}`);
  }
};

/**
 * Get all clients (with optional filters)
 */
export const getAllClients = async (limit = 50, offset = 0) => {
  try {
    const clients = await db('clients')
      .join('users', 'clients.user_id', 'users.id')
      .select('clients.*', 'users.email', 'users.first_name', 'users.last_name')
      .limit(limit)
      .offset(offset);

    // Add combined name field for frontend compatibility
    const clientsWithName = clients.map((client) => ({
      ...client,
      name: `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown Client',
    }));

    const total = await db('clients').count('* as count').first();

    return {
      data: clientsWithName,
      total: total.count,
      limit,
      offset,
    };
  } catch (error) {
    throw new Error(`Failed to get clients: ${error.message}`);
  }
};

/**
 * Get client progress summary
 */
export const getClientProgress = async (clientId) => {
  try {
    const client = await getClientById(clientId);
    const sessions = await db('sessions')
      .where('client_id', clientId)
      .where('status', 'completed')
      .orderBy('session_datetime', 'asc');

    return {
      client,
      totalSessionsCompleted: client.completed_sessions,
      riskScore: client.risk_score,
      sessions: sessions.map((s) => ({
        id: s.id,
        date: s.session_datetime,
        riskBefore: s.risk_score_before,
        riskAfter: s.risk_score_after,
        progress: s.progress_notes,
      })),
    };
  } catch (error) {
    throw new Error(`Failed to get client progress: ${error.message}`);
  }
};

export default {
  createClientProfile,
  getClientById,
  getClientByUserId,
  updateClientProfile,
  calculateRiskScore,
  getAllClients,
  getClientProgress,
};
