import { db } from '../config/db.js';

/**
 * Therapist Service
 * Handles all therapist-related business logic and ranking
 */

/**
 * Create therapist profile
 */
export const createTherapistProfile = async (userId, therapistData) => {
  try {
    const newTherapist = {
      user_id: userId,
      license_number: therapistData.license_number,
      specialization: therapistData.specialization,
      certifications: therapistData.certifications,
      years_of_experience: therapistData.years_of_experience || 0,
      available_hours: therapistData.available_hours || {},
      accepting_new_clients: therapistData.accepting_new_clients !== false,
      max_clients: therapistData.max_clients || 20,
    };

    const [therapistId] = await db('therapists').insert(newTherapist).returning('id');
    return getTherapistById(therapistId);
  } catch (error) {
    throw new Error(`Failed to create therapist profile: ${error.message}`);
  }
};

/**
 * Get therapist by ID with user info
 */
export const getTherapistById = async (therapistId) => {
  try {
    const therapist = await db('therapists')
      .join('users', 'therapists.user_id', 'users.id')
      .where('therapists.id', therapistId)
      .select('therapists.*', 'users.email', 'users.first_name', 'users.last_name', 'users.phone_number', 'users.profile_image_url', 'users.bio')
      .first();

    if (!therapist) {
      throw new Error('Therapist not found');
    }

    return therapist;
  } catch (error) {
    throw new Error(`Failed to get therapist: ${error.message}`);
  }
};

/**
 * Get therapist by user ID
 */
export const getTherapistByUserId = async (userId) => {
  try {
    const therapist = await db('therapists')
      .join('users', 'therapists.user_id', 'users.id')
      .where('therapists.user_id', userId)
      .select('therapists.*', 'users.email', 'users.first_name', 'users.last_name')
      .first();

    if (!therapist) {
      throw new Error('Therapist profile not found');
    }

    return therapist;
  } catch (error) {
    throw new Error(`Failed to get therapist: ${error.message}`);
  }
};

/**
 * Update therapist profile
 */
export const updateTherapistProfile = async (therapistId, updateData) => {
  try {
    const allowedFields = [
      'specialization',
      'certifications',
      'years_of_experience',
      'available_hours',
      'accepting_new_clients',
      'max_clients',
      'current_clients',
    ];

    const filteredData = Object.keys(updateData)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    filteredData.updated_at = new Date();

    await db('therapists').where('id', therapistId).update(filteredData);
    return getTherapistById(therapistId);
  } catch (error) {
    throw new Error(`Failed to update therapist profile: ${error.message}`);
  }
};

/**
 * Get ranked therapists
 * Business Logic: Therapist Ranking (moved from frontend to backend)
 * Rankings based on: rating, experience, availability, current client load
 */
export const getRankedTherapists = async (specialization = null, limit = 50) => {
  try {
    let query = db('therapists')
      .where('accepting_new_clients', true)
      .whereRaw('current_clients < max_clients');

    if (specialization) {
      query = query.where('specialization', specialization);
    }

    const therapists = await query
      .orderByRaw('average_rating DESC, years_of_experience DESC, total_sessions DESC')
      .limit(limit)
      .select(
        'therapists.*',
        'users.email',
        'users.first_name',
        'users.last_name',
        'users.phone_number',
        'users.profile_image_url'
      )
      .join('users', 'therapists.user_id', 'users.id');

    // Add ranking score for each therapist
    const rankedTherapists = therapists.map((t, index) => ({
      ...t,
      ranking_position: index + 1,
      ranking_score: calculateTherapistRankingScore(t),
    }));

    return rankedTherapists;
  } catch (error) {
    throw new Error(`Failed to get ranked therapists: ${error.message}`);
  }
};

/**
 * Calculate therapist ranking score
 * Composite score: (rating * 0.4) + (experience/10 * 0.3) + (availability * 0.3)
 */
const calculateTherapistRankingScore = (therapist) => {
  const ratingScore = (therapist.average_rating / 5) * 40; // 0-40 points
  const experienceScore = Math.min((therapist.years_of_experience / 20) * 30, 30); // 0-30 points
  const availabilityScore = ((therapist.max_clients - therapist.current_clients) / therapist.max_clients) * 30; // 0-30 points

  return Math.round(ratingScore + experienceScore + availabilityScore);
};

/**
 * Add therapist review and update rating
 */
export const addTherapistReview = async (therapistId, rating) => {
  try {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const therapist = await db('therapists').where('id', therapistId).first();

    // Calculate new average rating
    const newTotalReviews = therapist.total_reviews + 1;
    const newAverageRating =
      (therapist.average_rating * therapist.total_reviews + rating) / newTotalReviews;

    await db('therapists').where('id', therapistId).update({
      average_rating: newAverageRating.toFixed(2),
      total_reviews: newTotalReviews,
      updated_at: new Date(),
    });

    return getTherapistById(therapistId);
  } catch (error) {
    throw new Error(`Failed to add review: ${error.message}`);
  }
};

/**
 * Get all therapists with optional filters
 */
export const getAllTherapists = async (limit = 50, offset = 0) => {
  try {
    const therapists = await db('therapists')
      .join('users', 'therapists.user_id', 'users.id')
      .select('therapists.*', 'users.email', 'users.first_name', 'users.last_name')
      .limit(limit)
      .offset(offset);

    const total = await db('therapists').count('* as count').first();

    return {
      data: therapists,
      total: total.count,
      limit,
      offset,
    };
  } catch (error) {
    throw new Error(`Failed to get therapists: ${error.message}`);
  }
};

/**
 * Get therapist specializations
 */
export const getSpecializations = async () => {
  try {
    const specializations = await db('therapists')
      .distinct('specialization')
      .where('specialization', '!=', null)
      .pluck('specialization');

    return specializations;
  } catch (error) {
    throw new Error(`Failed to get specializations: ${error.message}`);
  }
};

export default {
  createTherapistProfile,
  getTherapistById,
  getTherapistByUserId,
  updateTherapistProfile,
  getRankedTherapists,
  addTherapistReview,
  getAllTherapists,
  getSpecializations,
};
