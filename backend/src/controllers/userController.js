import Joi from 'joi';
import * as userService from '../services/userService.js';

/**
 * User Controller
 * Thin layer that validates input and calls services
 */

/**
 * GET /api/users/profile - Get current user profile
 */
export const getCurrentUserProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);

    res.json({
      success: true,
      message: 'User profile retrieved',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:userId - Get specific user profile (admin only)
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await userService.getUserById(userId);

    res.json({
      success: true,
      message: 'User retrieved',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/profile - Update current user profile
 */
export const updateCurrentUserProfile = async (req, res, next) => {
  try {
    // Validate input
    const schema = Joi.object({
      first_name: Joi.string().optional(),
      last_name: Joi.string().optional(),
      phone_number: Joi.string().optional(),
      profile_image_url: Joi.string().uri().optional(),
      bio: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: { errors: error.details },
      });
    }

    const user = await userService.updateUserProfile(req.user.id, value);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users - Get all users (admin only)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, limit = 50, offset = 0 } = req.query;

    const result = await userService.getAllUsers(role, parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      message: 'Users retrieved',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:userId/role - Update user role (admin only)
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const schema = Joi.object({
      role: Joi.string().valid('admin', 'therapist', 'support', 'client').required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: { errors: error.details },
      });
    }

    const user = await userService.updateUserRole(userId, value.role);

    res.json({
      success: true,
      message: 'User role updated',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:userId/deactivate - Deactivate user (admin only)
 */
export const deactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Prevent self-deactivation
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account',
        data: null,
      });
    }

    const user = await userService.deactivateUser(userId);

    res.json({
      success: true,
      message: 'User deactivated',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCurrentUserProfile,
  getUserProfile,
  updateCurrentUserProfile,
  getAllUsers,
  updateUserRole,
  deactivateUser,
};
