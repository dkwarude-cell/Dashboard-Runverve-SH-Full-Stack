import { db } from '../config/db.js';

/**
 * Session Service
 * Handles all session-related business logic
 */

/**
 * Create session
 */
export const createSession = async (clientId, therapistId, sessionData) => {
  try {
    // Verify client and therapist exist
    const client = await db('clients').where('id', clientId).first();
    const therapist = await db('therapists').where('id', therapistId).first();

    if (!client || !therapist) {
      throw new Error('Client or therapist not found');
    }

    const newSession = {
      client_id: clientId,
      therapist_id: therapistId,
      session_datetime: sessionData.session_datetime,
      duration_minutes: sessionData.duration_minutes || 60,
      status: 'scheduled',
      notes: sessionData.notes,
    };

    const [sessionId] = await db('sessions').insert(newSession).returning('id');
    return getSessionById(sessionId);
  } catch (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }
};

/**
 * Get session by ID with client and therapist info
 */
export const getSessionById = async (sessionId) => {
  try {
    const session = await db('sessions')
      .join('clients', 'sessions.client_id', 'clients.id')
      .join('therapists', 'sessions.therapist_id', 'therapists.id')
      .join('users as client_user', 'clients.user_id', 'client_user.id')
      .join('users as therapist_user', 'therapists.user_id', 'therapist_user.id')
      .where('sessions.id', sessionId)
      .select(
        'sessions.*',
        'client_user.first_name as client_first_name',
        'client_user.last_name as client_last_name',
        'therapist_user.first_name as therapist_first_name',
        'therapist_user.last_name as therapist_last_name'
      )
      .first();

    if (!session) {
      throw new Error('Session not found');
    }

    return session;
  } catch (error) {
    throw new Error(`Failed to get session: ${error.message}`);
  }
};

/**
 * Update session status
 */
export const updateSessionStatus = async (sessionId, status, updateData = {}) => {
  try {
    const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const session = await db('sessions').where('id', sessionId).first();

    const updatePayload = {
      status,
      ...updateData,
      updated_at: new Date(),
    };

    // If completing session, update client session counts
    if (status === 'completed' && session.status !== 'completed') {
      const client = await db('clients').where('id', session.client_id).first();
      await db('clients').where('id', session.client_id).update({
        completed_sessions: client.completed_sessions + 1,
        total_sessions: client.total_sessions + 1,
        last_session_date: new Date(),
        updated_at: new Date(),
      });

      // Update therapist session count
      const therapist = await db('therapists').where('id', session.therapist_id).first();
      await db('therapists').where('id', session.therapist_id).update({
        total_sessions: therapist.total_sessions + 1,
        updated_at: new Date(),
      });
    }

    await db('sessions').where('id', sessionId).update(updatePayload);
    return getSessionById(sessionId);
  } catch (error) {
    throw new Error(`Failed to update session status: ${error.message}`);
  }
};

/**
 * Complete session with notes and rating
 */
export const completeSession = async (sessionId, completionData) => {
  try {
    const session = await db('sessions').where('id', sessionId).first();

    if (session.status === 'completed') {
      throw new Error('Session already completed');
    }

    const updateData = {
      status: 'completed',
      notes: completionData.notes,
      client_rating: completionData.client_rating,
      client_feedback: completionData.client_feedback,
      risk_score_before: completionData.risk_score_before,
      risk_score_after: completionData.risk_score_after,
      progress_category: completionData.progress_category,
      progress_notes: completionData.progress_notes,
      updated_at: new Date(),
    };

    await db('sessions').where('id', sessionId).update(updateData);

    // Update client counts
    const client = await db('clients').where('id', session.client_id).first();
    await db('clients').where('id', session.client_id).update({
      completed_sessions: client.completed_sessions + 1,
      total_sessions: client.total_sessions + 1,
      last_session_date: new Date(),
      updated_at: new Date(),
    });

    // Update therapist count
    const therapist = await db('therapists').where('id', session.therapist_id).first();
    await db('therapists').where('id', session.therapist_id).update({
      total_sessions: therapist.total_sessions + 1,
      updated_at: new Date(),
    });

    // If client provided rating, update therapist rating
    if (completionData.client_rating) {
      await db('therapists').where('id', session.therapist_id).update({
        average_rating: db.raw(
          `(average_rating * total_reviews + ? ) / (total_reviews + 1)`,
          [completionData.client_rating]
        ),
        total_reviews: db.raw('total_reviews + 1'),
      });
    }

    return getSessionById(sessionId);
  } catch (error) {
    throw new Error(`Failed to complete session: ${error.message}`);
  }
};

/**
 * Get all sessions for a client
 */
export const getClientSessions = async (clientId, status = null, limit = 50, offset = 0) => {
  try {
    let query = db('sessions')
      .where('client_id', clientId)
      .orderBy('session_datetime', 'desc');

    if (status) {
      query = query.where('status', status);
    }

    const sessions = await query.limit(limit).offset(offset);
    const total = await db('sessions').where('client_id', clientId).count('* as count').first();

    return {
      data: sessions,
      total: total.count,
      limit,
      offset,
    };
  } catch (error) {
    throw new Error(`Failed to get client sessions: ${error.message}`);
  }
};

/**
 * Get all sessions for a therapist
 */
export const getTherapistSessions = async (therapistId, status = null, limit = 50, offset = 0) => {
  try {
    let query = db('sessions')
      .where('therapist_id', therapistId)
      .orderBy('session_datetime', 'desc');

    if (status) {
      query = query.where('status', status);
    }

    const sessions = await query.limit(limit).offset(offset);
    const total = await db('sessions').where('therapist_id', therapistId).count('* as count').first();

    return {
      data: sessions,
      total: total.count,
      limit,
      offset,
    };
  } catch (error) {
    throw new Error(`Failed to get therapist sessions: ${error.message}`);
  }
};

/**
 * Cancel session
 */
export const cancelSession = async (sessionId, reason) => {
  try {
    await db('sessions').where('id', sessionId).update({
      status: 'cancelled',
      notes: reason,
      updated_at: new Date(),
    });

    return getSessionById(sessionId);
  } catch (error) {
    throw new Error(`Failed to cancel session: ${error.message}`);
  }
};

/**
 * Get session statistics for a period
 */
export const getSessionStats = async (startDate, endDate) => {
  try {
    const stats = await db('sessions')
      .whereBetween('session_datetime', [startDate, endDate])
      .select(db.raw('status, COUNT(*) as count'))
      .groupBy('status');

    return stats.reduce((acc, stat) => {
      acc[stat.status] = stat.count;
      return acc;
    }, {});
  } catch (error) {
    throw new Error(`Failed to get session stats: ${error.message}`);
  }
};

export default {
  createSession,
  getSessionById,
  updateSessionStatus,
  completeSession,
  getClientSessions,
  getTherapistSessions,
  cancelSession,
  getSessionStats,
};
