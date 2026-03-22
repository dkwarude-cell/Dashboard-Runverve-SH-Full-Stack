import Joi from 'joi';
import * as sessionService from '../services/sessionService.js';

/**
 * Session Controller
 */

/**
 * POST /api/sessions - Create new session
 */
export const createSession = async (req, res, next) => {
  try {
    const schema = Joi.object({
      client_id: Joi.string().uuid().required(),
      therapist_id: Joi.string().uuid().required(),
      session_datetime: Joi.date().iso().required(),
      duration_minutes: Joi.number().optional(),
      notes: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: { errors: error.details },
      });
    }

    const session = await sessionService.createSession(value.client_id, value.therapist_id, value);

    res.status(201).json({
      success: true,
      message: 'Session created',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sessions/:sessionId - Get session details
 */
export const getSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await sessionService.getSessionById(sessionId);

    res.json({
      success: true,
      message: 'Session retrieved',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/sessions/:sessionId - Update session
 */
export const updateSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const schema = Joi.object({
      duration_minutes: Joi.number().optional(),
      notes: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: { errors: error.details },
      });
    }

    const session = await sessionService.updateSessionStatus(sessionId, 'scheduled', value);

    res.json({
      success: true,
      message: 'Session updated',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/sessions/:sessionId/complete - Complete session with feedback
 */
export const completeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const schema = Joi.object({
      notes: Joi.string().optional(),
      client_rating: Joi.number().min(1).max(5).optional(),
      client_feedback: Joi.string().optional(),
      risk_score_before: Joi.number().optional(),
      risk_score_after: Joi.number().optional(),
      progress_category: Joi.string().optional(),
      progress_notes: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: { errors: error.details },
      });
    }

    const session = await sessionService.completeSession(sessionId, value);

    res.json({
      success: true,
      message: 'Session completed',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/sessions/:sessionId/cancel - Cancel session
 */
export const cancelSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { reason } = req.body;

    const schema = Joi.object({
      reason: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: { errors: error.details },
      });
    }

    const session = await sessionService.cancelSession(sessionId, value.reason);

    res.json({
      success: true,
      message: 'Session cancelled',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sessions/client/:clientId - Get all sessions for a client
 */
export const getClientSessions = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { status, limit = 50, offset = 0 } = req.query;

    const result = await sessionService.getClientSessions(
      clientId,
      status,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({
      success: true,
      message: 'Client sessions retrieved',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sessions/therapist/:therapistId - Get all sessions for a therapist
 */
export const getTherapistSessions = async (req, res, next) => {
  try {
    const { therapistId } = req.params;
    const { status, limit = 50, offset = 0 } = req.query;

    const result = await sessionService.getTherapistSessions(
      therapistId,
      status,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({
      success: true,
      message: 'Therapist sessions retrieved',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sessions/stats - Get session statistics
 */
export const getSessionStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate are required',
        data: null,
      });
    }

    const stats = await sessionService.getSessionStats(new Date(startDate), new Date(endDate));

    res.json({
      success: true,
      message: 'Session statistics retrieved',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createSession,
  getSession,
  updateSession,
  completeSession,
  cancelSession,
  getClientSessions,
  getTherapistSessions,
  getSessionStats,
};
