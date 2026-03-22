import express from 'express';
import * as therapistController from '../controllers/therapistController.js';
import { verifyFirebaseJWT } from '../middleware/auth.js';
import { requireAdminRole, requireTherapistRole, requireRole } from '../middleware/rbac.js';

const router = express.Router();

/**
 * Therapist Routes
 */

// Create therapist profile (admin only)
router.post('/', verifyFirebaseJWT, requireAdminRole, therapistController.createTherapistProfile);

// Get ranked therapists (everyone can access)
router.get('/ranked', verifyFirebaseJWT, therapistController.getRankedTherapists);

// Get all specializations
router.get('/specializations', verifyFirebaseJWT, therapistController.getSpecializations);

// Get all therapists
router.get('/', verifyFirebaseJWT, therapistController.getAllTherapists);

// Get current therapist profile
router.get('/my-profile', verifyFirebaseJWT, requireTherapistRole, therapistController.getCurrentTherapistProfile);

// Get specific therapist profile
router.get('/:therapistId', verifyFirebaseJWT, therapistController.getTherapistProfile);

// Update therapist profile (therapist or admin)
router.put('/:therapistId', verifyFirebaseJWT, requireRole('therapist', 'admin'), therapistController.updateTherapistProfile);

// Add review to therapist
router.post('/:therapistId/review', verifyFirebaseJWT, therapistController.addTherapistReview);

export default router;
