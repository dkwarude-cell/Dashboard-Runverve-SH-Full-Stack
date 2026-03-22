# Analytics Integration Guide

Quick reference for integrating analytics in frontend and backend.

---

## Quick Start

### 1. Populate Database with Dummy Data

```bash
cd backend
npm run seed:data
```

Output shows: ✓ 12 clients, ✓ 4 therapists, ✓ 79 sessions

### 2. Start Backend Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### 3. Test Analytics Endpoints

```bash
# Get full dashboard
curl http://localhost:3000/api/v1/analytics/dashboard

# Get client statistics
curl http://localhost:3000/api/v1/analytics/clients

# Get risk assessment
curl http://localhost:3000/api/v1/analytics/risk
```

---

## Backend Integration Examples

### Using Analytics Service Directly

```typescript
// Import the service
import analyticsService from "../services/analyticsService.js";

// Get dashboard analytics
const dashboard = await analyticsService.getDashboardAnalytics();

// Get specific metrics
const clientStats = await analyticsService.getClientStatistics();
const riskData = await analyticsService.getRiskAssessment();

// Get single entity analytics
const clientAnalytics = await analyticsService.getClientAnalytics(clientId);
const therapistAnalytics =
  await analyticsService.getTherapistAnalytics(therapistId);
```

### Creating Custom Endpoints

```typescript
// Example: Get high-risk clients with specific criteria
export async function getHighRiskClientsNeedingFollowUp(req, res) {
  try {
    const riskData = await analyticsService.getRiskAssessment();

    // Filter for clients needing immediate action
    const urgent = riskData.data.atRiskClients.filter((client) => {
      const daysSinceSession = client.lastSessionDaysAgo;
      const hasMultipleFactors = client.riskFactors.length > 2;

      return daysSinceSession > 14 && hasMultipleFactors;
    });

    res.json({
      success: true,
      count: urgent.length,
      clients: urgent,
      actionRequired: urgent.map((c) => ({
        clientId: c.id,
        reason: urgent[0].riskFactors.join(", "),
        suggestedAction: "Follow-up call needed",
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

### Scheduled Analytics Refresh

```typescript
// backend/src/jobs/analyticsRefresh.js
import cron from "node-cron";
import analyticsService from "../services/analyticsService.js";

// Refresh analytics every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("📊 Refreshing analytics cache...");

  try {
    const freshData = await analyticsService.getDashboardAnalytics();

    // Store in cache or update computed_analytics table
    console.log("✓ Analytics refreshed");
  } catch (error) {
    console.error("✗ Analytics refresh failed:", error);
  }
});

export default analyticsRefresh;
```

---

## Frontend Integration Examples

### React Native Hook Pattern

```typescript
// hooks/useAnalytics.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      // Call backend analytics endpoint
      const response = await fetch(
        "http://localhost:3000/api/v1/analytics/dashboard",
        {
          headers: {
            Authorization: `Bearer ${await supabase.auth.session()?.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch analytics");

      const data = await response.json();
      setAnalytics(data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return { analytics, loading, error, refetch: fetchAnalytics };
}
```

### Dashboard Component

```typescript
// screens/AnalyticsScreen.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAnalytics } from '../hooks/useAnalytics';
import PieChart from '../components/charts/PieChart';
import LineChart from '../components/charts/LineChart';

export default function AnalyticsScreen() {
  const { analytics, loading } = useAnalytics();

  if (loading) return <Text>Loading analytics...</Text>;

  // Risk Distribution Pie Chart
  const riskChartData = {
    labels: analytics.clientStats.riskDistribution.map(d => d.level),
    datasets: [{
      data: analytics.clientStats.riskDistribution.map(d => d.count),
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
    }]
  };

  // Monthly Growth Line Chart
  const growthChartData = {
    labels: analytics.monthlyGrowth.trend.map(m => m.label),
    datasets: [{
      label: 'Sessions',
      data: analytics.monthlyGrowth.trend.map(m => m.totalSessions),
      borderColor: '#3b82f6',
      fill: false
    }]
  };

  // Session Status Bar Chart
  const sessionStatusData = {
    labels: analytics.sessionStats.byStatus.map(s => s.status),
    datasets: [{
      label: 'Sessions',
      data: analytics.sessionStats.byStatus.map(s => s.count),
      backgroundColor: '#8b5cf6'
    }]
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* KPI Cards */}
      <View className="mb-6">
        <StatCard
          title="Total Clients"
          value={analytics.clientStats.total}
          change="+2.5%"
        />
      </View>

      {/* Risk Distribution */}
      <View className="mb-6 bg-gray-50 p-4 rounded-lg">
        <Text className="text-lg font-bold mb-4">Client Risk Distribution</Text>
        <PieChart data={riskChartData} />
      </View>

      {/* Session Completion Rate */}
      <View className="mb-6 bg-gray-50 p-4 rounded-lg">
        <Text className="text-lg font-bold mb-2">Session Completion</Text>
        <Text className="text-2xl font-bold text-green-600">
          {analytics.sessionStats.completionRate}%
        </Text>
      </View>

      {/* At-Risk Clients Alert */}
      {analytics.riskAssessment.atRiskCount > 0 && (
        <View className="mb-6 bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
          <Text className="text-lg font-bold text-red-700">
            ⚠️ {analytics.riskAssessment.atRiskCount} At-Risk Clients
          </Text>
          <View>
            {analytics.riskAssessment.atRiskClients.slice(0, 3).map(client => (
              <Text key={client.id} className="text-sm text-red-600 mt-2">
                • {client.name}: {client.riskFactors.join(', ')}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Monthly Growth Chart */}
      <View className="mb-6 bg-gray-50 p-4 rounded-lg">
        <Text className="text-lg font-bold mb-4">6-Month Trend</Text>
        <LineChart data={growthChartData} />
      </View>

      {/* Therapist Performance */}
      <View className="mb-6 bg-gray-50 p-4 rounded-lg">
        <Text className="text-lg font-bold mb-4">Top Therapists</Text>
        {analytics.therapistPerformance.topTherapists.map(therapist => (
          <View key={therapist.id} className="py-2 border-b border-gray-200">
            <Text className="font-semibold">{therapist.name}</Text>
            <Text className="text-sm text-gray-600">
              ⭐ {therapist.rating} | {therapist.totalSessions} sessions |
              {therapist.capacityPercentage}% capacity
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
```

### Risk Alert Component

```typescript
// components/RiskAlert.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAnalytics } from '../hooks/useAnalytics';

export function RiskAlert() {
  const { analytics } = useAnalytics();

  if (!analytics?.riskAssessment.atRiskCount) return null;

  return (
    <View className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
      <Text className="text-red-700 font-bold">
        🚨 {analytics.riskAssessment.atRiskCount} clients at risk
      </Text>

      {/* Low Adherence */}
      {analytics.riskAssessment.riskIndicators.lowAdherence > 0 && (
        <Text className="text-sm text-red-600 mt-1">
          • {analytics.riskAssessment.riskIndicators.lowAdherence} with low adherence
        </Text>
      )}

      {/* Never Attended */}
      {analytics.riskAssessment.riskIndicators.neverAttended > 0 && (
        <Text className="text-sm text-red-600 mt-1">
          • {analytics.riskAssessment.riskIndicators.neverAttended} never attended
        </Text>
      )}

      {/* No Recent Session */}
      {analytics.riskAssessment.riskIndicators.noRecentSession > 0 && (
        <Text className="text-sm text-red-600 mt-1">
          • {analytics.riskAssessment.riskIndicators.noRecentSession} no recent session
        </Text>
      )}

      <TouchableOpacity className="mt-3 bg-red-600 px-3 py-2 rounded">
        <Text className="text-white font-semibold text-sm">View Details</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## Example API Responses

### Client Statistics Response

```json
{
  "success": true,
  "data": {
    "total": 12,
    "activeThisMonth": 11,
    "inactiveThisMonth": 1,
    "byDiagnosis": [
      {
        "diagnosis": "Major Depressive Disorder",
        "count": 3
      },
      {
        "diagnosis": "Generalized Anxiety Disorder",
        "count": 2
      }
    ],
    "riskDistribution": [
      {
        "level": "Low",
        "count": 4
      },
      {
        "level": "Medium",
        "count": 5
      },
      {
        "level": "High",
        "count": 3
      }
    ],
    "atRiskCount": 3,
    "atRiskPercentage": "25.0"
  }
}
```

### At-Risk Clients Response

```json
{
  "success": true,
  "data": {
    "atRiskCount": 3,
    "atRiskClients": [
      {
        "id": "cl-uuid-001",
        "name": "John Smith",
        "diagnosis": "Major Depressive Disorder",
        "riskScore": "4.35",
        "adherenceRate": "42.9",
        "lastSessionDaysAgo": 5,
        "riskFactors": ["Low adherence", "High risk score"]
      },
      {
        "id": "cl-uuid-002",
        "name": "Emily Johnson",
        "diagnosis": "Generalized Anxiety Disorder",
        "riskScore": "3.78",
        "adherenceRate": "38.1",
        "lastSessionDaysAgo": 8,
        "riskFactors": ["Low adherence", "No recent session"]
      }
    ],
    "riskIndicators": {
      "lowAdherence": 4,
      "neverAttended": 1,
      "noRecentSession": 2
    },
    "recommendations": [
      "Multiple at-risk clients detected. Consider group intervention programs.",
      "1 clients have never attended. Follow up with engagement strategies.",
      "4 clients have low adherence. Review barriers to attendance."
    ]
  }
}
```

### Therapist Performance Response

```json
{
  "success": true,
  "data": {
    "topTherapists": [
      {
        "id": "th-uuid-001",
        "name": "Dr. Sarah Williams",
        "specialization": "Cognitive Behavioral Therapy",
        "rating": "4.8",
        "totalSessions": 145,
        "currentClients": 18,
        "maxClients": 25,
        "capacityPercentage": "72"
      }
    ],
    "totalTherapists": 4,
    "specializations": [
      {
        "name": "Cognitive Behavioral Therapy",
        "count": 1
      },
      {
        "name": "Trauma & PTSD",
        "count": 1
      }
    ],
    "workloadDistribution": [
      {
        "status": "At Capacity",
        "count": 1
      },
      {
        "status": "Moderate Load",
        "count": 2
      },
      {
        "status": "Available",
        "count": 1
      }
    ]
  }
}
```

---

## Testing Endpoints with cURL

### Get All Analytics

```bash
curl -X GET http://localhost:3000/api/v1/analytics/dashboard \
  -H "Content-Type: application/json" | jq .
```

### Get Client Stats

```bash
curl -X GET http://localhost:3000/api/v1/analytics/clients \
  -H "Content-Type: application/json" | jq .
```

### Get Risk Assessment

```bash
curl -X GET http://localhost:3000/api/v1/analytics/risk \
  -H "Content-Type: application/json" | jq .data.atRiskClients
```

### Get Therapist Performance

```bash
curl -X GET http://localhost:3000/api/v1/analytics/therapists \
  -H "Content-Type: application/json" | jq .data.topTherapists
```

### Get Monthly Growth

```bash
curl -X GET http://localhost:3000/api/v1/analytics/growth \
  -H "Content-Type: application/json" | jq .data.trend
```

---

## Postman Collection

Save as `analytics.postman_collection.json`:

```json
{
  "info": {
    "name": "SmartHeal Analytics API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Dashboard",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/api/v1/analytics/dashboard",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "analytics", "dashboard"]
        }
      }
    },
    {
      "name": "Clients",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/api/v1/analytics/clients",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "analytics", "clients"]
        }
      }
    },
    {
      "name": "Risk Assessment",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/api/v1/analytics/risk",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "analytics", "risk"]
        }
      }
    },
    {
      "name": "Therapists",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/api/v1/analytics/therapists",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "analytics", "therapists"]
        }
      }
    },
    {
      "name": "Growth",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/api/v1/analytics/growth",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "analytics", "growth"]
        }
      }
    }
  ]
}
```

---

## Troubleshooting

### Analytics endpoints return 404

**Check:** Are analytics routes imported in `src/app.js`?

```typescript
import analyticsRoutes from "./routes/analyticsRoutes.js";
app.use(`/api/${apiVersion}/analytics`, analyticsRoutes);
```

### Risk scores seem incorrect

**Verify:** Risk calculation based on adherence

```
if (adherence < 50%) → High risk
if (adherence < 70%) → Medium risk
else → Low risk
```

### Empty response from endpoints

**Check:** Database has been seeded

```bash
npm run seed:data
```

### Slow response times

**Analyze:** Check for missing database indices

```sql
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_client ON sessions(client_id);
CREATE INDEX idx_clients_risk ON clients(risk_score);
```

---

## Summary

The analytics system provides:

✅ **9 REST endpoints** for different metrics
✅ **Real-time computed analytics** from database
✅ **Frontend-ready responses** (JSON format)
✅ **12 client profiles** with complete history
✅ **79 sessions** showing realistic patterns
✅ **Risk identification** algorithms ready to use

Start with: `npm run seed:data` → Then call `/api/v1/analytics/dashboard`
