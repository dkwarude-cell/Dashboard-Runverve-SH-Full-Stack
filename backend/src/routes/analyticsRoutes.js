/**
 * Analytics Routes
 * Endpoints for retrieving computed analytics and metrics
 */

import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { verifyFirebaseJWT } from '../middleware/auth.js';

const router = express.Router();

/**
 * Dashboard Analytics
 * GET /api/v1/analytics/dashboard
 * Returns: All computed analytics for main dashboard
 */
router.get('/dashboard', verifyFirebaseJWT, analyticsController.getDashboardAnalytics);

/**
 * Client Statistics
 * GET /api/v1/analytics/clients
 * Returns: Total, active, by diagnosis, by risk level
 */
router.get('/clients', verifyFirebaseJWT, analyticsController.getClientStats);

/**
 * Session Statistics
 * GET /api/v1/analytics/sessions
 * Returns: Activity metrics and session breakdown
 */
router.get('/sessions', verifyFirebaseJWT, analyticsController.getSessionStats);

/**
 * Therapy Outcomes
 * GET /api/v1/analytics/outcomes
 * Returns: Success rates, progress, client ratings
 */
router.get('/outcomes', verifyFirebaseJWT, analyticsController.getTherapyOutcomes);

/**
 * Therapist Performance
 * GET /api/v1/analytics/therapists
 * Returns: Rankings, performance, workload
 */
router.get('/therapists', verifyFirebaseJWT, analyticsController.getTherapistPerformance);

/**
 * Monthly Growth
 * GET /api/v1/analytics/growth
 * Returns: 6-month trend data
 */
router.get('/growth', verifyFirebaseJWT, analyticsController.getMonthlyGrowth);

/**
 * Risk Assessment
 * GET /api/v1/analytics/risk
 * Returns: At-risk clients, indicators, recommendations
 */
router.get('/risk', verifyFirebaseJWT, analyticsController.getRiskAssessment);

/**
 * Client-Specific Analytics
 * GET /api/v1/analytics/clients/:clientId
 * Returns: Detailed analytics for a specific client
 */
router.get('/clients/:clientId', verifyFirebaseJWT, analyticsController.getClientAnalytics);

/**
 * Therapist-Specific Analytics
 * GET /api/v1/analytics/therapists/:therapistId
 * Returns: Detailed analytics for a specific therapist
 */
router.get('/therapists/:therapistId', verifyFirebaseJWT, analyticsController.getTherapistAnalytics);

export default router;
