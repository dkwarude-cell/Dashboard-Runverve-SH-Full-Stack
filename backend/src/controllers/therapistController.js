import Joi from 'joi';
import * as therapistService from '../services/therapistService.js';

/**
 * Therapist Controller
 */

/**
 * POST /api/therapists - Create therapist profile (admin only)
 */
export const createTherapistProfile = async (req, res, next) => {
  try {
    const schema = Joi.object({
      user_id: Joi.string().uuid().required(),
      license_number: Joi.string().required(),
      specialization: Joi.string().required(),
      certifications: Joi.string().optional(),
      years_of_experience: Joi.number().optional(),
      available_hours: Joi.object().optional(),
      accepting_new_clients: Joi.boolean().optional(),
      max_clients: Joi.number().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: { errors: error.details },
      });
    }

    const therapist = await therapistService.createTherapistProfile(value.user_id, value);

    res.status(201).json({
      success: true,
      message: 'Therapist profile created',
      data: therapist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/therapists/:therapistId - Get therapist profile
 */
export const getTherapistProfile = async (req, res, next) => {
  try {
    const { therapistId } = req.params;
    const therapist = await therapistService.getTherapistById(therapistId);

    res.json({
      success: true,
      message: 'Therapist retrieved',
      data: therapist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/therapists/my-profile - Get current therapist profile
 */
export const getCurrentTherapistProfile = async (req, res, next) => {
  try {
    const therapist = await therapistService.getTherapistByUserId(req.user.id);

    res.json({
      success: true,
      message: 'Therapist profile retrieved',
      data: therapist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/therapists/:therapistId - Update therapist profile
 */
export const updateTherapistProfile = async (req, res, next) => {
  try {
    const { therapistId } = req.params;

    const schema = Joi.object({
      specialization: Joi.string().optional(),
      certifications: Joi.string().optional(),
      years_of_experience: Joi.number().optional(),
      available_hours: Joi.object().optional(),
      accepting_new_clients: Joi.boolean().optional(),
      max_clients: Joi.number().optional(),
      current_clients: Joi.number().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: { errors: error.details },
      });
    }

    const therapist = await therapistService.updateTherapistProfile(therapistId, value);

    res.json({
      success: true,
      message: 'Therapist profile updated',
      data: therapist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/therapists/ranked - Get ranked therapists
 * This demonstrates business logic in the backend
 */
export const getRankedTherapists = async (req, res, next) => {
  try {
    const { specialization, limit = 50 } = req.query;

    const therapists = await therapistService.getRankedTherapists(specialization, parseInt(limit));

    res.json({
      success: true,
      message: 'Ranked therapists retrieved',
      data: therapists,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/therapists - Get all therapists
 */
export const getAllTherapists = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await therapistService.getAllTherapists(parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      message: 'Therapists retrieved',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/therapists/specializations - Get all specializations
 */
export const getSpecializations = async (req, res, next) => {
  try {
    const specializations = await therapistService.getSpecializations();

    res.json({
      success: true,
      message: 'Specializations retrieved',
      data: specializations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/therapists/:therapistId/review - Add review to therapist
 */
export const addTherapistReview = async (req, res, next) => {
  try {
    const { therapistId } = req.params;
    const { rating } = req.body;

    const schema = Joi.object({
      rating: Joi.number().min(1).max(5).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: { errors: error.details },
      });
    }

    const therapist = await therapistService.addTherapistReview(therapistId, value.rating);

    res.json({
      success: true,
      message: 'Review added',
      data: therapist,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createTherapistProfile,
  getTherapistProfile,
  getCurrentTherapistProfile,
  updateTherapistProfile,
  getRankedTherapists,
  getAllTherapists,
  getSpecializations,
  addTherapistReview,
};
