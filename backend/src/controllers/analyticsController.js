/**
 * Analytics Controller
 * Handles analytics endpoints that return computed metrics
 */

import * as analyticsService from '../services/analyticsService.js';

/**
 * GET /api/v1/analytics/dashboard
 * Returns comprehensive dashboard analytics
 */
export async function getDashboardAnalytics(req, res) {
  try {
    const result = await analyticsService.getDashboardAnalytics();

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * GET /api/v1/analytics/clients
 * Returns client statistics
 */
export async function getClientStats(req, res) {
  try {
    const stats = await analyticsService.getClientStatistics();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * GET /api/v1/analytics/sessions
 * Returns session statistics
 */
export async function getSessionStats(req, res) {
  try {
    const stats = await analyticsService.getSessionStatistics();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * GET /api/v1/analytics/outcomes
 * Returns therapy outcomes data
 */
export async function getTherapyOutcomes(req, res) {
  try {
    const outcomes = await analyticsService.getTherapyOutcomes();

    res.json({
      success: true,
      data: outcomes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * GET /api/v1/analytics/therapists
 * Returns therapist performance data
 */
export async function getTherapistPerformance(req, res) {
  try {
    const performance = await analyticsService.getTherapistPerformance();

    res.json({
      success: true,
      data: performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * GET /api/v1/analytics/growth
 * Returns monthly growth trends
 */
export async function getMonthlyGrowth(req, res) {
  try {
    const growth = await analyticsService.getMonthlyGrowth();

    res.json({
      success: true,
      data: growth,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * GET /api/v1/analytics/risk
 * Returns risk assessment data
 */
export async function getRiskAssessment(req, res) {
  try {
    const risk = await analyticsService.getRiskAssessment();

    res.json({
      success: true,
      data: risk,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * GET /api/v1/analytics/clients/:clientId
 * Returns analytics for a specific client
 */
export async function getClientAnalytics(req, res) {
  try {
    const { clientId } = req.params;

    const result = await analyticsService.getClientAnalytics(clientId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * GET /api/v1/analytics/therapists/:therapistId
 * Returns analytics for a specific therapist
 */
export async function getTherapistAnalytics(req, res) {
  try {
    const { therapistId } = req.params;

    const result = await analyticsService.getTherapistAnalytics(therapistId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

export default {
  getDashboardAnalytics,
  getClientStats,
  getSessionStats,
  getTherapyOutcomes,
  getTherapistPerformance,
  getMonthlyGrowth,
  getRiskAssessment,
  getClientAnalytics,
  getTherapistAnalytics,
};
