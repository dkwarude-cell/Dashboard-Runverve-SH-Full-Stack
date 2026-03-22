import Joi from 'joi';
import * as clientService from '../services/clientService.js';

/**
 * Client Controller
 */

/**
 * POST /api/clients - Create client profile
 */
export const createClientProfile = async (req, res, next) => {
  try {
    const schema = Joi.object({
      diagnosis: Joi.string().required(),
      medical_history: Joi.string().optional(),
      emergency_contact_name: Joi.string().required(),
      emergency_contact_phone: Joi.string().required(),
      session_preference: Joi.string().valid('weekly', 'biweekly', 'monthly').optional(),
      session_duration_minutes: Joi.number().optional(),
      timezone: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: { errors: error.details },
      });
    }

    const client = await clientService.createClientProfile(req.user.id, value);

    res.status(201).json({
      success: true,
      message: 'Client profile created',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/clients/:clientId - Get client profile
 */
export const getClientProfile = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const client = await clientService.getClientById(clientId);

    res.json({
      success: true,
      message: 'Client retrieved',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/clients/my-profile - Get current user's client profile
 */
export const getCurrentClientProfile = async (req, res, next) => {
  try {
    const client = await clientService.getClientByUserId(req.user.id);

    res.json({
      success: true,
      message: 'Client profile retrieved',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/clients/:clientId - Update client profile
 */
export const updateClientProfile = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const schema = Joi.object({
      diagnosis: Joi.string().optional(),
      medical_history: Joi.string().optional(),
      emergency_contact_name: Joi.string().optional(),
      emergency_contact_phone: Joi.string().optional(),
      session_preference: Joi.string().valid('weekly', 'biweekly', 'monthly').optional(),
      session_duration_minutes: Joi.number().optional(),
      timezone: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: { errors: error.details },
      });
    }

    const client = await clientService.updateClientProfile(clientId, value);

    res.json({
      success: true,
      message: 'Client profile updated',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/clients::clientId/progress - Get client progress
 */
export const getClientProgress = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const progress = await clientService.getClientProgress(clientId);

    res.json({
      success: true,
      message: 'Client progress retrieved',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/clients/:clientId/risk-score - Get client risk score
 */
export const getClientRiskScore = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    // Recalculate and get risk score
    const riskScore = await clientService.calculateRiskScore(clientId);
    const client = await clientService.getClientById(clientId);

    res.json({
      success: true,
      message: 'Risk score retrieved',
      data: {
        clientId,
        riskScore,
        client,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/clients - Get all clients (admin/support only)
 */
export const getAllClients = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await clientService.getAllClients(parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      message: 'Clients retrieved',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createClientProfile,
  getClientProfile,
  getCurrentClientProfile,
  updateClientProfile,
  getClientProgress,
  getClientRiskScore,
  getAllClients,
};
