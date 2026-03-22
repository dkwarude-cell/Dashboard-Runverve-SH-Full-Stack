import { db } from '../config/db.js';

/**
 * User Service
 * Handles all user-related business logic
 */

/**
 * Get or create user from Firebase data
 */
export const getOrCreateUser = async (firebaseData) => {
  try {
    // Check if user exists
    let user = await db('users')
      .where('firebase_uid', firebaseData.uid)
      .first();

    if (user) {
      return user;
    }

    // Create new user
    const newUser = {
      firebase_uid: firebaseData.uid,
      email: firebaseData.email,
      first_name: firebaseData.name?.split(' ')[0] || '',
      last_name: firebaseData.name?.split(' ')[1] || '',
      role: 'client', // Default role, can be updated by admin
    };

    const [userId] = await db('users').insert(newUser).returning('id');

    user = await db('users').where('id', userId).first();
    return user;
  } catch (error) {
    throw new Error(`Failed to get or create user: ${error.message}`);
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const user = await db('users').where('id', userId).first();
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

/**
 * Get user by Firebase UID
 */
export const getUserByFirebaseUid = async (firebaseUid) => {
  try {
    const user = await db('users').where('firebase_uid', firebaseUid).first();
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updateData) => {
  try {
    const allowedFields = ['first_name', 'last_name', 'phone_number', 'profile_image_url', 'bio'];
    const filteredData = Object.keys(updateData)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    filteredData.updated_at = new Date();

    await db('users').where('id', userId).update(filteredData);
    return getUserById(userId);
  } catch (error) {
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
};

/**
 * Get all users with optional role filter
 */
export const getAllUsers = async (role = null, limit = 50, offset = 0) => {
  try {
    let query = db('users');

    if (role) {
      query = query.where('role', role);
    }

    const users = await query.limit(limit).offset(offset);
    const total = await db('users').count('* as count').first();

    return {
      data: users,
      total: total.count,
      limit,
      offset,
    };
  } catch (error) {
    throw new Error(`Failed to get users: ${error.message}`);
  }
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (userId, newRole) => {
  try {
    const validRoles = ['admin', 'therapist', 'support', 'client'];
    if (!validRoles.includes(newRole)) {
      throw new Error(`Invalid role: ${newRole}`);
    }

    await db('users').where('id', userId).update({
      role: newRole,
      updated_at: new Date(),
    });

    return getUserById(userId);
  } catch (error) {
    throw new Error(`Failed to update user role: ${error.message}`);
  }
};

/**
 * Deactivate user
 */
export const deactivateUser = async (userId) => {
  try {
    await db('users').where('id', userId).update({
      is_active: false,
      updated_at: new Date(),
    });

    return getUserById(userId);
  } catch (error) {
    throw new Error(`Failed to deactivate user: ${error.message}`);
  }
};

export default {
  getOrCreateUser,
  getUserById,
  getUserByFirebaseUid,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
  deactivateUser,
};
