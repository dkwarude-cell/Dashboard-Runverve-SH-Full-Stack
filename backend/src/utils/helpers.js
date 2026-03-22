import { v4 as uuidv4 } from 'uuid';

/**
 * Generate UUID
 */
export const generateId = () => uuidv4();

/**
 * Format timestamp
 */
export const formatTimestamp = (date = new Date()) => {
  return date.toISOString();
};

/**
 * Parse pagination parameters
 */
export const parsePagination = (limit = 50, offset = 0) => {
  return {
    limit: Math.min(parseInt(limit) || 50, 100),
    offset: Math.max(parseInt(offset) || 0, 0),
  };
};

/**
 * Calculate age from birth date
 */
export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Sanitize object (remove sensitive fields)
 */
export const sanitizeUser = (user) => {
  const { firebase_uid, ...rest } = user;
  return rest;
};

/**
 * Create standard error
 */
export class APIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'APIError';
  }
}

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

export default {
  generateId,
  formatTimestamp,
  parsePagination,
  calculateAge,
  sanitizeUser,
  APIError,
  isValidEmail,
  isValidPhone,
};
