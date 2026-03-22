import express from 'express';
import * as clientController from '../controllers/clientController.js';
import { verifyFirebaseJWT } from '../middleware/auth.js';
import { requireRole, requireClientRole } from '../middleware/rbac.js';

const router = express.Router();

/**
 * Client Routes
 */

// Create client profile
router.post('/', verifyFirebaseJWT, clientController.createClientProfile);

// Get current user's client profile
router.get('/my-profile', verifyFirebaseJWT, requireClientRole, clientController.getCurrentClientProfile);

// Get specific client profile
router.get('/:clientId', verifyFirebaseJWT, clientController.getClientProfile);

// Update client profile
router.put('/:clientId', verifyFirebaseJWT, clientController.updateClientProfile);

// Get client progress
router.get('/:clientId/progress', verifyFirebaseJWT, clientController.getClientProgress);

// Get client risk score
router.get('/:clientId/risk-score', verifyFirebaseJWT, clientController.getClientRiskScore);

// Get all clients (admin/support only)
router.get('/', verifyFirebaseJWT, requireRole('admin', 'support'), clientController.getAllClients);

export default router;
