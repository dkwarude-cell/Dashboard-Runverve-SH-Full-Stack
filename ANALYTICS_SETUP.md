# SmartHeal Dashboard - Dummy Data & Analytics Setup Guide

## Overview

This guide covers the complete setup of dummy data for the SmartHeal Dashboard and explains how analytics are calculated and used across the application.

## Quick Start

### 1. **Run Database Schema**

```sql
-- Instructions:
1. Go to your Supabase Project Dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy entire contents of: supabase/schema.sql
5. Click "Run"
```

### 2. **Seed Dummy Data**

```sql
-- Instructions:
1. Click "New Query" in SQL Editor
2. Copy entire contents of: supabase/seed.sql
3. Click "Run"
```

### 3. **Verify Data Loaded**

- Go to Supabase: Table Editor
- You should see:
  - ✅ profiles: 4 therapists
  - ✅ clients: 12 clients
  - ✅ sessions: 25 sessions
  - ✅ devices: 6 devices
  - ✅ queries: 6 support tickets
  - ✅ analytics_events: 20 events

---

## Dummy Data Overview

### Therapists/Doctors (4 profiles)

| Name              | Email                  | Role      | ID          |
| ----------------- | ---------------------- | --------- | ----------- |
| Dr. Rajesh Sharma | dr.sharma@smartheal.io | Admin     | t1000000... |
| Dr. Neha Patel    | dr.patel@smartheal.io  | Therapist | t1000000... |
| Dr. Priya Singh   | dr.singh@smartheal.io  | Therapist | t1000000... |
| SmartHeal Support | support@smartheal.io   | Support   | t1000000... |

### Clients (12 total)

**Active Clients (9):**

- Priya Sharma - Orthopedic, 78% progress, 92% adherence ⭐ Good
- Ananya Iyer - Sports Medicine, 92% progress, 98% adherence ⭐⭐ Excellent
- Deepika Singh - Cardiac, 82% progress, 91% adherence ⭐ Good
- Meera Nair - Orthopedic, 88% progress, 95% adherence ⭐ Good
- Karthik Rao - Sports Medicine, 95% progress, 99% adherence ⭐⭐ Top Performer
- Arjun Patel - Neurological, 65% progress, 85% adherence
- Aditya Joshi - Sports Medicine, 72% progress, 88% adherence
- Rajesh Kumar - Orthopedic, 60% progress, 75% adherence
- Rohan Gupta - Neurological, 55% progress, 78% adherence

**Inactive Clients (3):**

- ⚠️ Kavya Menon - General, 35% progress, 60% adherence
- ⚠️ Sneha Desai - General, 20% progress, 40% adherence (Highest Risk)
- Vikram Reddy - Cardiac, 45% progress, 70% adherence (Declining -2.1%)

### Sessions (25 total)

- **Completed:** 18 sessions (avg 82% progress)
- **Scheduled:** 4 sessions (upcoming)
- **Cancelled:** 3 sessions

**Therapy Types:**

- Ultrasound Therapy: 8 sessions
- Neurostimulation: 4 sessions
- EMS Therapy: 4 sessions
- Cardiac Rehab: 5 sessions
- TENS Therapy: 2 sessions
- General Wellness: 2 sessions

### Devices (6 total)

- 4 Connected, 1 Standby, 1 Offline
- Types: Ultrasound, Neurostimulation, EMS, TENS, Cardiac Monitor
- Battery: 15% - 91%

### Support Queries (6 total)

| Priority | Status      | Issue                         |
| -------- | ----------- | ----------------------------- |
| Critical | Open        | Device firmware update failed |
| High     | Open        | Device connectivity issues    |
| High     | In Progress | Pain during EMS session       |
| Medium   | In Progress | Billing inquiry               |
| Low      | New         | Therapy protocol adjustment   |
| Low      | Closed      | Session rescheduling          |

### Analytics Events (20 total)

- Daily login/signup tracking
- 10 logins (various dates)
- 10 signups (various dates)
- Useful for growth charts

---

## Analytics Calculations

### 1. Client Statistics

Calculated via `calculateClientStats()` in `lib/analytics.ts`:

```
Total Clients: 12
- Active: 9 (75%)
- Inactive: 3 (25%)

Average Progress: 65%
Average Adherence: 79%

By Therapy Type:
- Orthopedic: 4
- Cardiac: 2
- Sports Medicine: 2
- Neurological: 2
- General: 2
```

### 2. Session Statistics

Calculated via `calculateSessionStats()`:

```
Total Sessions: 25
- Completed: 18 (72%)
- Scheduled: 4
- Cancelled: 3

Completion Rate: 72%
Average Session Progress: 82% (completed only)
```

### 3. Therapy Outcomes

Calculated via `calculateTherapyOutcomes()`:

```
Ultrasound Therapy:
- Avg Progress: 79%
- Sessions: 8
- Success Rate: 75% (>70% progress)

Neurostimulation:
- Avg Progress: 68%
- Sessions: 4
- Success Rate: 50%

EMS Therapy:
- Avg Progress: 88%
- Sessions: 4
- Success Rate: 100%
```

### 4. Therapist Performance

Calculated via `calculateTherapistPerformance()`:

```
Dr. Neha Patel (Top Performer):
- Clients: 8
- Completed Sessions: 13
- Avg Client Progress: 76%
- Avg Session Progress: 85%

Dr. Priya Singh:
- Clients: 3
- Completed Sessions: 5
- Avg Client Progress: 48%
- Avg Session Progress: 68%

Dr. Rajesh Sharma:
- Clients: 5
- Completed Sessions: 8
- Avg Client Progress: 63%
- Avg Session Progress: 71%
```

### 5. At-Risk Client Identification

Calculated via `identifyRiskClients()`:

**High Risk (2):**

- Sneha Desai: Low adherence (40%), minimal progress (20%), inactive
- Kavya Menon: Low adherence (60%), below-average progress (35%), inactive

**Medium Risk (1):**

- Vikram Reddy: Active but declining (-2.1% trend), low progress (45%)

**Action Items:**

- Contact inactive clients
- Reassess therapy protocols
- Increase motivation/engagement

### 6. Monthly Growth Trends

Calculated via `calculateMonthlyGrowth()`:

```
January 2026:
- Active Clients: 2
- Completed Sessions: 2

February 2026:
- Active Clients: 5
- Completed Sessions: 8

March 2026:
- Active Clients: 9
- Completed Sessions: 8
```

---

## Using Analytics in Components

### Import the Hook

```typescript
import { useAnalytics } from "@/hooks/useAnalytics";
```

### Access Data

```typescript
export default function MyAnalyticsScreen() {
  const {
    // Chart data
    clientDistribution,
    sessionTrends,
    therapyOutcomes,
    growthData,

    // Calculated statistics
    clientStats,
    sessionStats,
    therapistPerformance,
    riskClients,

    // State management
    loading,
    refresh,
  } = useAnalytics();

  // Display client metrics
  if (clientStats) {
    console.log(`Total Clients: ${clientStats.total}`);
    console.log(`Active: ${clientStats.active}`);
    console.log(`Average Progress: ${clientStats.avgProgress}%`);
    console.log(`Average Adherence: ${clientStats.avgAdherence}%`);
  }

  // Show therapist rankings
  therapistPerformance.forEach((therapist, index) => {
    console.log(`${index + 1}. ${therapist.therapistName}`);
    console.log(`   Sessions: ${therapist.completedSessions}`);
    console.log(`   Avg Progress: ${therapist.avgSessionProgress}%`);
  });

  // Alert for at-risk clients
  if (riskClients.length > 0) {
    console.log(`⚠️ ${riskClients.length} clients at risk`);
    riskClients.forEach(client => {
      console.log(`\n${client.clientName} - ${client.riskLevel.toUpperCase()}`);
      client.reasons.forEach(r => console.log(`  • ${r}`));
    });
  }

  return (
    // Use data in JSX...
  );
}
```

---

## Screen-by-Screen Implementation

### Dashboard Screen (`DashboardScreen.tsx`)

**Current Usage:**

- Uses `useDashboard()` for main stats
- Shows: total clients, active sessions, completion rate, devices

**Enhanced with useAnalytics():**

- Add therapist workload info
- Show top performing therapist
- Display at-risk client alerts
- Monthly trend charts

### Analytics Screen (`AnalyticsScreen.tsx`)

**Uses:** `useAnalytics()`

**Displays:**

1. Client Distribution Pie Chart
2. Session Trends Bar Chart
3. Therapy Outcomes Bar Chart
4. Growth Data Line Chart

**Can Add:**

- Therapist Performance Rankings
- At-Risk Client List
- Therapy Success Rates by Type
- Monthly Client Growth Widget

### Client Management (`ClientManagementScreen.tsx`)

**Uses:** `useClients()`

**Enhancements:**

- Highlight at-risk clients (red badge)
- Show progress trends
- Display therapist assignment
- Color-code by adherence level

### Therapy Sessions (`SessionHistoryScreen.tsx`)

**Uses:** `useSessions()`

**Enhancements:**

- Show therapist names (via analytics)
- Display therapy success rates
- Highlight missed/cancelled sessions
- Show progress trends by therapy type

---

## Database Queries

All queries use Supabase PostgREST API with real-time subscriptions:

### Fetch All Clients

```
supabase.from('clients').select('*')
```

### Fetch Sessions by Status

```
supabase.from('sessions').select('*').eq('status', 'Completed')
```

### Fetch Therapist Performance

```
supabase.from('profiles').select('*').eq('role', 'therapist')
```

### Fetch Therapy Outcomes

```
supabase.from('sessions').select('therapy_type, progress, status').eq('status', 'Completed')
```

---

## Performance Optimization

### Current Implementation

- ✅ Parallel data fetching with `Promise.all()`
- ✅ Efficient calculations in `lib/analytics.ts`
- ✅ Memoized hook with `useCallback`

### Future Optimizations

- Add database views for pre-calculated metrics
- Implement result caching (5-10 min cache)
- Use Supabase RPC functions for complex queries
- Add pagination for large datasets
- Pre-calculate top therapists daily

### Database Indexing

```sql
-- Recommended indexes for better performance
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_clients_therapist_id ON clients(therapist_id);
CREATE INDEX idx_sessions_therapist_id ON sessions(therapist_id);
CREATE INDEX idx_clients_status ON clients(status);
```

---

## Extending the Dummy Data

### Add More Clients

Edit `supabase/seed.sql` and add to INSERT statement:

```sql
('c1000000-0000-0000-0000-000000000013', 'New Client Name',
 'email@example.com', '+1-555-123-4567', '#color',
 75, 20, 85, 'now', 5.2, 'Active', 'Orthopedic',
 't1000000-0000-0000-0000-000000000002', 'Notes here'),
```

### Add More Sessions

```sql
('c1000000-0000-0000-0000-000000000001',
 't1000000-0000-0000-0000-000000000002',
 'Ultrasound Therapy', '2026-03-15', '10:00 AM',
 '45 min', 'Scheduled', 0, 'Session notes'),
```

### Add More Analytics Calculations

Edit `lib/analytics.ts`:

1. Define new interface type
2. Create calculation function
3. Add to `calculateAllAnalytics()`
4. Export from hook in `useAnalytics.ts`

---

## Troubleshooting

### Issue: "No data showing in dashboard"

**Solutions:**

1. ✅ Verify schema.sql was executed
2. ✅ Verify seed.sql was executed
3. ✅ Check Supabase browser console for errors
4. ✅ Verify `.env` has correct SUPABASE_URL and ANON_KEY
5. ✅ Check RLS policies (should allow authenticated SELECT)

### Issue: "Therapist names showing as undefined"

**Solutions:**

1. ✅ Verify profiles table has therapist records
2. ✅ Check therapist_id values match in sessions table
3. ✅ Re-run seed.sql if data corrupted

### Issue: "Analytics calculations seem wrong"

**Solutions:**

1. ✅ Check client/session progress values in database
2. ✅ Verify `lib/analytics.ts` calculation logic
3. ✅ Test with sample data in browser console
4. ✅ Check filtering logic for status/types

### Issue: "Real-time updates not working"

**Solutions:**

1. ✅ Check Supabase subscription is active
2. ✅ Verify RLS policies allow subscriptions
3. ✅ Test with manual refresh button
4. ✅ Check network tab for failed requests

---

## File Reference

- **Database Schema:** `supabase/schema.sql`
- **Dummy Data:** `supabase/seed.sql`
- **Analytics Logic:** `lib/analytics.ts`
- **Analytics Hook:** `hooks/useAnalytics.ts`
- **Documentation:** `DUMMY_DATA_SETUP.ts` (detailed code comments)
- **Setup Guide:** `ANALYTICS_SETUP.md` (this file)

---

## Next Steps

1. ✅ Run schema.sql in Supabase
2. ✅ Run seed.sql in Supabase
3. ✅ Verify data in Supabase Table Editor
4. ✅ Restart dev server if running
5. ✅ Navigate to Analytics page in app
6. ✅ View real dummy data in charts and metrics

---

## Support

For issues or questions:

1. Check Supabase logs for SQL errors
2. Review browser console for JavaScript errors
3. Verify all IDs and foreign keys in seed.sql
4. Check that `.env` variables are set correctly
5. Test queries manually in Supabase SQL Editor
