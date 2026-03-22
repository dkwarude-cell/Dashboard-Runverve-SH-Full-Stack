import express from 'express';
import * as sessionController from '../controllers/sessionController.js';
import { verifyFirebaseJWT } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

/**
 * Session Routes
 */

// Create session
router.post('/', verifyFirebaseJWT, requireRole('admin', 'therapist'), sessionController.createSession);

// Get session details
router.get('/:sessionId', verifyFirebaseJWT, sessionController.getSession);

// Update session
router.put('/:sessionId', verifyFirebaseJWT, sessionController.updateSession);

// Complete session with feedback
router.put('/:sessionId/complete', verifyFirebaseJWT, sessionController.completeSession);

// Cancel session
router.put('/:sessionId/cancel', verifyFirebaseJWT, sessionController.cancelSession);

// Get client sessions
router.get('/client/:clientId', verifyFirebaseJWT, sessionController.getClientSessions);

// Get therapist sessions
router.get('/therapist/:therapistId', verifyFirebaseJWT, sessionController.getTherapistSessions);

// Get session statistics (admin only)
router.get('/stats', verifyFirebaseJWT, requireRole('admin', 'support'), sessionController.getSessionStats);

export default router;
