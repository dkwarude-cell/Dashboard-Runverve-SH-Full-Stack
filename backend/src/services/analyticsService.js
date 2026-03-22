/**
 * Analytics Service
 * Computes analytics metrics from stored database records
 * Mirrors frontend logic but operates server-side on persistent data
 */

import db from '../config/db.js';

/**
 * Get comprehensive analytics dashboard data
 * Combines multiple metrics similar to frontend useAnalytics hook
 */
export async function getDashboardAnalytics() {
  try {
    const [
      clientStats,
      sessionStats,
      therapyOutcomes,
      therapistPerformance,
      monthlyGrowth,
      riskAssessment,
    ] = await Promise.all([
      getClientStatistics(),
      getSessionStatistics(),
      getTherapyOutcomes(),
      getTherapistPerformance(),
      getMonthlyGrowth(),
      getRiskAssessment(),
    ]);

    return {
      success: true,
      data: {
        clientStats,
        sessionStats,
        therapyOutcomes,
        therapistPerformance,
        monthlyGrowth,
        riskAssessment,
        generatedAt: new Date(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * CLIENT STATISTICS
 * Returns: total, active, by diagnosis, by risk level
 */
export async function getClientStatistics() {
  const stats = await db('clients').count('id as total').first();
  const total = parseInt(stats.total);

  // Active clients (had session in last 30 days)
  const active = await db('clients')
    .count('id as count')
    .whereRaw('last_session_date > datetime("now", "-30 days")')
    .first();

  // By diagnosis
  const byDiagnosis = await db('clients')
    .select('diagnosis')
    .count('id as count')
    .groupBy('diagnosis');

  // By risk level (LOW: <2, MEDIUM: 2-3.5, HIGH: >3.5)
  const riskDistribution = await db('clients')
    .select(
      db.raw(`CASE 
        WHEN risk_score < 2 THEN 'Low'
        WHEN risk_score >= 2 AND risk_score < 3.5 THEN 'Medium'
        ELSE 'High'
      END as risk_level`),
    )
    .count('id as count')
    .groupBy(db.raw(`CASE 
      WHEN risk_score < 2 THEN 'Low'
      WHEN risk_score >= 2 AND risk_score < 3.5 THEN 'Medium'
      ELSE 'High'
    END`));

  // At-risk clients (risk_score > 3.5)
  const atRiskCount = await db('clients').count('id as count').where('risk_score', '>', 3.5).first();

  return {
    total,
    activeThisMonth: parseInt(active.count),
    inactiveThisMonth: total - parseInt(active.count),
    byDiagnosis: byDiagnosis.map((d) => ({
      diagnosis: d.diagnosis,
      count: parseInt(d.count),
    })),
    riskDistribution: riskDistribution.map((r) => ({
      level: r.risk_level,
      count: parseInt(r.count),
    })),
    atRiskCount: parseInt(atRiskCount.count),
    atRiskPercentage: ((parseInt(atRiskCount.count) / total) * 100).toFixed(1),
  };
}

/**
 * SESSION STATISTICS
 * Returns: total, by status, completion rate, average duration, scheduling data
 */
export async function getSessionStatistics() {
  const total = await db('sessions').count('id as count').first();

  // By status
  const byStatus = await db('sessions')
    .select('status')
    .count('id as count')
    .groupBy('status');

  // Completion rate
  const completed = await db('sessions')
    .count('id as count')
    .where('status', 'completed')
    .first();

  const completionRate = (parseInt(completed.count) / parseInt(total.count) * 100).toFixed(1);

  // Average duration
  const avgDuration = await db('sessions')
    .avg('duration_minutes as avg_duration')
    .first();

  // This month sessions
  const thisMonth = await db('sessions')
    .count('id as count')
    .whereRaw('session_datetime > datetime("now", "-30 days")')
    .first();

  // No-show rate
  const noShows = await db('sessions')
    .count('id as count')
    .where('status', 'no_show')
    .first();

  const noShowRate = (parseInt(noShows.count) / parseInt(total.count) * 100).toFixed(1);

  return {
    total: parseInt(total.count),
    byStatus: byStatus.map((s) => ({
      status: s.status,
      count: parseInt(s.count),
    })),
    completionRate,
    noShowRate,
    averageDurationMinutes: Math.round(avgDuration.avg_duration || 60),
    thisMonthSessions: parseInt(thisMonth.count),
    withClientRating: await db('sessions')
      .count('id as count')
      .whereNotNull('client_rating')
      .first()
      .then((r) => parseInt(r.count)),
  };
}

/**
 * THERAPY OUTCOMES
 * Returns: success rate, progress trends, rating distribution
 */
export async function getTherapyOutcomes() {
  // Progress categories
  const progressTrends = await db('sessions')
    .select('progress_category')
    .count('id as count')
    .groupBy('progress_category')
    .where('status', 'completed');

  // Average client rating
  const avgRating = await db('sessions')
    .avg('client_rating as avg')
    .whereNotNull('client_rating')
    .first();

  // Rating distribution
  const ratingDistribution = await db('sessions')
    .select(
      db.raw(`CASE 
        WHEN client_rating >= 4.5 THEN 'Excellent'
        WHEN client_rating >= 3.5 THEN 'Good'
        WHEN client_rating >= 2.5 THEN 'Fair'
        ELSE 'Poor'
      END as rating_category`),
    )
    .count('id as count')
    .whereNotNull('client_rating')
    .groupBy(db.raw(`CASE 
      WHEN client_rating >= 4.5 THEN 'Excellent'
      WHEN client_rating >= 3.5 THEN 'Good'
      WHEN client_rating >= 2.5 THEN 'Fair'
      ELSE 'Poor'
    END`));

  // Risk score improvement
  const riskImprovement = await db('sessions')
    .select(
      db.raw('AVG(risk_score_before - risk_score_after) as avg_improvement'),
      db.raw('COUNT(*) as count'),
    )
    .where('status', 'completed')
    .first();

  return {
    progressTrends: progressTrends.map((p) => ({
      category: p.progress_category,
      count: parseInt(p.count),
    })),
    averageClientRating: parseFloat(avgRating.avg || 0).toFixed(2),
    ratingDistribution: ratingDistribution.map((r) => ({
      category: r.rating_category,
      count: parseInt(r.count),
    })),
    averageRiskImprovement: parseFloat(riskImprovement.avg_improvement || 0).toFixed(2),
    totalSessionsAnalyzed: parseInt(riskImprovement.count),
  };
}

/**
 * THERAPIST PERFORMANCE
 * Returns: rankings, specialization data, client loads
 */
export async function getTherapistPerformance() {
  // Top therapists by average rating and session count
  const topTherapists = await db('therapists')
    .select(
      'therapists.id',
      'users.first_name',
      'users.last_name',
      'therapists.specialization',
      'therapists.average_rating',
      'therapists.total_sessions',
      'therapists.current_clients',
      'therapists.max_clients',
    )
    .join('users', 'therapists.user_id', '=', 'users.id')
    .orderBy('therapists.average_rating', 'desc')
    .limit(10);

  // Session counts per therapist
  const sessionCounts = await db('sessions')
    .select('therapist_id')
    .count('id as sessions_completed')
    .where('status', 'completed')
    .groupBy('therapist_id');

  // Specialization distribution
  const specializations = await db('therapists')
    .select('specialization')
    .count('id as count')
    .groupBy('specialization');

  // Workload analysis
  const workloadAnalysis = await db('therapists')
    .select(
      db.raw(`CASE 
        WHEN current_clients / max_clients >= 0.8 THEN 'At Capacity'
        WHEN current_clients / max_clients >= 0.5 THEN 'Moderate Load'
        ELSE 'Available'
      END as load_status`),
    )
    .count('id as count')
    .groupBy(db.raw(`CASE 
      WHEN current_clients / max_clients >= 0.8 THEN 'At Capacity'
      WHEN current_clients / max_clients >= 0.5 THEN 'Moderate Load'
      ELSE 'Available'
    END`));

  return {
    topTherapists: topTherapists.map((t) => ({
      id: t.id,
      name: `${t.first_name} ${t.last_name}`,
      specialization: t.specialization,
      rating: parseFloat(t.average_rating).toFixed(1),
      totalSessions: t.total_sessions,
      currentClients: t.current_clients,
      maxClients: t.max_clients,
      capacityPercentage: ((t.current_clients / t.max_clients) * 100).toFixed(0),
    })),
    totalTherapists: topTherapists.length,
    specializations: specializations.map((s) => ({
      name: s.specialization,
      count: parseInt(s.count),
    })),
    workloadDistribution: workloadAnalysis.map((w) => ({
      status: w.load_status,
      count: parseInt(w.count),
    })),
  };
}

/**
 * MONTHLY GROWTH
 * Returns: growth trends over last 6 months
 */
export async function getMonthlyGrowth() {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    });
  }

  const monthlyData = await Promise.all(
    months.map(async (m) => {
      const startDate = new Date(m.year, m.month - 1, 1);
      const endDate = new Date(m.year, m.month, 0);

      const [newClients, sessions, completedSessions] = await Promise.all([
        db('clients')
          .count('id as count')
          .whereBetween('created_at', [startDate, endDate])
          .first(),
        db('sessions')
          .count('id as count')
          .whereBetween('created_at', [startDate, endDate])
          .first(),
        db('sessions')
          .count('id as count')
          .where('status', 'completed')
          .whereBetween('created_at', [startDate, endDate])
          .first(),
      ]);

      return {
        month: m.month,
        year: m.year,
        label: new Date(m.year, m.month - 1).toLocaleString('default', { month: 'short' }),
        newClientsAdded: parseInt(newClients.count),
        totalSessions: parseInt(sessions.count),
        completedSessions: parseInt(completedSessions.count),
        completionRate:
          parseInt(sessions.count) > 0
            ? ((parseInt(completedSessions.count) / parseInt(sessions.count)) * 100).toFixed(1)
            : 0,
      };
    }),
  );

  return {
    trend: monthlyData,
    averageMonthlyNewClients: (
      monthlyData.reduce((sum, m) => sum + m.newClientsAdded, 0) / monthlyData.length
    ).toFixed(1),
    averageMonthlySessions: (
      monthlyData.reduce((sum, m) => sum + m.totalSessions, 0) / monthlyData.length
    ).toFixed(1),
  };
}

/**
 * RISK ASSESSMENT
 * Returns: at-risk clients, trends, indicators
 */
export async function getRiskAssessment() {
  // Get at-risk clients
  const atRiskClients = await db('clients')
    .select(
      'clients.id',
      'clients.diagnosis',
      'clients.risk_score',
      'clients.total_sessions',
      'clients.completed_sessions',
      'users.first_name',
      'users.last_name',
      'clients.last_session_date',
    )
    .join('users', 'clients.user_id', '=', 'users.id')
    .where('risk_score', '>', 3.5)
    .orderBy('risk_score', 'desc')
    .limit(20);

  // Risk indicators
  const lowAdherence = await db('clients')
    .count('id as count')
    .whereRaw('(completed_sessions * 1.0 / total_sessions) < 0.5')
    .first();

  const neverAttended = await db('clients')
    .count('id as count')
    .where('completed_sessions', 0)
    .first();

  const noRecentSession = await db('clients')
    .count('id as count')
    .whereRaw('last_session_date < datetime("now", "-21 days")')
    .first();

  return {
    atRiskCount: atRiskClients.length,
    atRiskClients: atRiskClients.map((c) => ({
      id: c.id,
      name: `${c.first_name} ${c.last_name}`,
      diagnosis: c.diagnosis,
      riskScore: parseFloat(c.risk_score).toFixed(2),
      adherenceRate: (
        (c.completed_sessions / Math.max(c.total_sessions, 1)) *
        100
      ).toFixed(1),
      lastSessionDaysAgo: Math.floor(
        (new Date() - new Date(c.last_session_date)) / (1000 * 60 * 60 * 24),
      ),
      riskFactors: identifyRiskFactors(c),
    })),
    riskIndicators: {
      lowAdherence: parseInt(lowAdherence.count),
      neverAttended: parseInt(neverAttended.count),
      noRecentSession: parseInt(noRecentSession.count),
    },
    recommendations: generateRiskRecommendations(atRiskClients),
  };
}

/**
 * HELPER: Identify risk factors for a client
 */
function identifyRiskFactors(client) {
  const factors = [];

  const adherenceRate = client.completed_sessions / Math.max(client.total_sessions, 1);
  if (adherenceRate < 0.5) factors.push('Low adherence');

  if (client.completed_sessions === 0) factors.push('Never attended session');

  const daysSinceSession = (new Date() - new Date(client.last_session_date)) / (1000 * 60 * 60 * 24);
  if (daysSinceSession > 21) factors.push('No recent session');

  if (client.risk_score > 4) factors.push('High risk score');

  return factors;
}

/**
 * HELPER: Generate recommendations based on at-risk clients
 */
function generateRiskRecommendations(atRiskClients) {
  const recommendations = [];

  if (atRiskClients.length > 5) {
    recommendations.push('Multiple at-risk clients detected. Consider group intervention programs.');
  }

  const neverAttended = atRiskClients.filter((c) => c.completed_sessions === 0);
  if (neverAttended.length > 0) {
    recommendations.push(
      `${neverAttended.length} clients have never attended. Follow up with engagement strategies.`,
    );
  }

  const lowAdherence = atRiskClients.filter(
    (c) => c.completed_sessions / Math.max(c.total_sessions, 1) < 0.5,
  );
  if (lowAdherence.length > 0) {
    recommendations.push(`${lowAdherence.length} clients have low adherence. Review barriers.`);
  }

  return recommendations.length > 0
    ? recommendations
    : ['All clients at manageable risk levels. Continue monitoring.'];
}

/**
 * Get analytics by specific client
 */
export async function getClientAnalytics(clientId) {
  try {
    // Client info
    const client = await db('clients')
      .select('*')
      .where('id', clientId)
      .first();

    if (!client) {
      return { success: false, error: 'Client not found' };
    }

    // Sessions for this client
    const sessions = await db('sessions')
      .select('*')
      .where('client_id', clientId)
      .orderBy('session_datetime', 'desc');

    // Metrics
    const analytics = await db('analytics')
      .select('*')
      .where('user_id', client.user_id);

    // Calculate metrics
    const completedSessions = sessions.filter((s) => s.status === 'completed').length;
    const averageRating =
      sessions
        .filter((s) => s.client_rating)
        .reduce((sum, s) => sum + parseFloat(s.client_rating), 0) / sessions.length || 0;

    return {
      success: true,
      data: {
        client,
        sessionCount: sessions.length,
        completionRate: ((completedSessions / sessions.length) * 100).toFixed(1),
        averageClientRating: averageRating.toFixed(2),
        recentSessions: sessions.slice(0, 5),
        analyticsMetrics: analytics,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get analytics by specific therapist
 */
export async function getTherapistAnalytics(therapistId) {
  try {
    // Therapist info
    const therapist = await db('therapists')
      .select('*')
      .where('id', therapistId)
      .first();

    if (!therapist) {
      return { success: false, error: 'Therapist not found' };
    }

    // Sessions for this therapist
    const sessions = await db('sessions')
      .select('*')
      .where('therapist_id', therapistId)
      .orderBy('session_datetime', 'desc');

    const completedSessions = sessions.filter((s) => s.status === 'completed').length;
    const avgClientRating =
      sessions
        .filter((s) => s.client_rating)
        .reduce((sum, s) => sum + parseFloat(s.client_rating), 0) / sessions.length || 0;

    // Clients assigned to this therapist
    const clients = await db('sessions')
      .distinct('client_id')
      .where('therapist_id', therapistId);

    return {
      success: true,
      data: {
        therapist,
        totalSessions: sessions.length,
        completedSessions,
        completionRate: ((completedSessions / sessions.length) * 100).toFixed(1),
        averageClientRating: avgClientRating.toFixed(2),
        uniqueClientsServed: clients.length,
        recentSessions: sessions.slice(0, 5),
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default {
  getDashboardAnalytics,
  getClientStatistics,
  getSessionStatistics,
  getTherapyOutcomes,
  getTherapistPerformance,
  getMonthlyGrowth,
  getRiskAssessment,
  getClientAnalytics,
  getTherapistAnalytics,
};
