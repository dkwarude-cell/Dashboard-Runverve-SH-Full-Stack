import express from 'express';
import * as userController from '../controllers/userController.js';
import { verifyFirebaseJWT } from '../middleware/auth.js';
import { requireAdminRole } from '../middleware/rbac.js';

const router = express.Router();

/**
 * User Routes
 */

// Get current user profile
router.get('/profile', verifyFirebaseJWT, userController.getCurrentUserProfile);

// Update current user profile
router.put('/profile', verifyFirebaseJWT, userController.updateCurrentUserProfile);

// Get all users (admin only)
router.get('/', verifyFirebaseJWT, requireAdminRole, userController.getAllUsers);

// Get specific user profile (admin only)
router.get('/:userId', verifyFirebaseJWT, requireAdminRole, userController.getUserProfile);

// Update user role (admin only)
router.put('/:userId/role', verifyFirebaseJWT, requireAdminRole, userController.updateUserRole);

// Deactivate user (admin only)
router.put('/:userId/deactivate', verifyFirebaseJWT, requireAdminRole, userController.deactivateUser);

export default router;
