# React Native Frontend Codebase Analysis

## SmartHeal Dashboard (Dashboard-Runverve-SH-Full-Stack)

---

## 1. DATA STRUCTURES & HOOKS

### 1.1 Type System (lib/database.types.ts)

**Primary Tables:**

- `Profile` - Users (therapists, admins, support staff)
- `Client` - Patient records
- `Session` - Therapy sessions
- `Query` - Support tickets
- `Device` - Medical equipment
- `Message` - Communications
- `AnalyticsEvent` - Event tracking (login/signup)

**Key Client Fields:**

```
id, name, email, phone, avatar_color, progress (0-100),
sessions (count), adherence (0-100), last_active, change (trend),
status (Active/Inactive), profile_type, therapist_id, notes, timestamps
```

**Key Session Fields:**

```
id, client_id, therapist_id, therapy_type, date, time, duration,
status (Completed/Scheduled/Cancelled/In Progress), progress (0-100), notes
```

---

### 1.2 Core Hooks Overview

| Hook                 | Purpose                      | Key State                                                                | Real-time Features                      |
| -------------------- | ---------------------------- | ------------------------------------------------------------------------ | --------------------------------------- |
| `useAnalytics()`     | Calculates dashboard metrics | clientStats, sessionStats, riskClients, therapistPerformance, chart data | Data fetched on load, manual refresh    |
| `useDashboard()`     | Dashboard summary stats      | stats (4 KPIs), monthlyData, recentClients, todaysSchedule               | RPC calls for aggregated data           |
| `useClients()`       | Client CRUD & list           | clients[], loading, error, stats                                         | Real-time Postgres changes subscription |
| `useSessions()`      | Session CRUD & filtering     | sessions[], loading, error, stats                                        | Real-time Postgres changes subscription |
| `useDevices()`       | Device management            | devices[], stats (Connected/Standby/Offline)                             | Real-time subscription                  |
| `useQueries()`       | Support ticket management    | queries[], responses (by ID), stats                                      | Real-time subscription                  |
| `useMessages()`      | Messaging system             | contacts[], messages (by contact), unread count                          | Real-time message arrival               |
| `useAIChat()`        | AI assistant integration     | chatHistory[], isThinking, attachments support                           | Async API calls                         |
| `useNotifications()` | In-app notifications         | notifications[], unreadCount                                             | Demo data, manual add/dismiss           |
| `useResponsive()`    | Layout responsiveness        | width, height, isMobile, isDesktop, columns                              | Event listener on dimension changes     |

---

### 1.3 Key Hook Details

#### `useAnalytics()` - Deep Dive

```typescript
// Fetches from 4 tables in parallel
const [clientsData, sessionsData, therapistsData, eventsData] =
  await Promise.all([
    supabase.from('clients').select('*'),
    supabase.from('sessions').select('*'),
    supabase.from('profiles').select('*').eq('role', 'therapist'),
    supabase.from('analytics_events').select(...)
  ])

// Returns:
{
  // Chart data
  clientDistribution: { label, value, color }[],
  sessionTrends: { label, values: [{ value, color, label }] }[],
  therapyOutcomes: { label, values }[],
  growthData: { label, values }[],

  // Statistics
  clientStats: ClientStats,
  sessionStats: SessionStats,
  therapistPerformance: TherapistPerformance[],
  riskClients: ClientRisk[],
  loading: boolean
}
```

#### `useClients()` - Features

```typescript
// CRUD operations
createClient(ClientInsert)
updateClient(id, ClientUpdate)
deleteClient(id)

// Search & filtering
searchClients(query) // Searches name, email, phone with ilike

// Computed stats
stats = {
  total: clients.length,
  active: count where status='Active',
  inactive: count where status='Inactive',
  avgProgress: average of client.progress,
}

// Real-time: subscribes to postgres_changes on 'clients' table
```

#### `useSessions()` - Features

```typescript
// CRUD with date ordering
filterSessions(status); // Filter by Completed/Scheduled/Cancelled/In Progress

// Stats
stats = {
  total,
  completed,
  scheduled,
  cancelled,
};

// Real-time: subscribes to postgres_changes
```

---

## 2. DATA FLOW & AUTHENTICATION

### 2.1 Authentication Flow

```
┌─────────────────────────────────────────┐
│  AuthProvider (lib/auth.tsx)            │
├─────────────────────────────────────────┤
│ • Wraps app at root                     │
│ • Manages user session state            │
│ • Handles OAuth (Google/GitHub)         │
│ • Demo login mode (dr@smartheal.io)     │
└─────────────────────────────────────────┘
          ↓
    useAuth() hook
          ↓
┌─────────────────────────────────────────┐
│ Returns {user, profile, session, loading}│
└─────────────────────────────────────────┘
          ↓
Protected Routes (app/(app)/_layout.tsx)
  • Redirects to /(auth)/login if !user
  • Fetches profile (from profiles table)
```

**Demo User:**

```
Email: admin@smartheal.io
Role: admin
Name: Dr. SmartHeal Admin
```

---

### 2.2 Data Flow Architecture

```
SUPABASE (Backend)
├── auth.users (Supabase Auth)
├── profiles (therapists, admins)
├── clients (patient data)
├── sessions (therapy sessions)
├── queries (support tickets)
├── devices (medical equipment)
├── messages (communications)
└── analytics_events (tracking)

        ↓ (Supabase Client)

HOOKS LAYER
├── useAuth() → User & profile context
├── useClients() → Client CRUD + list
├── useSessions() → Session CRUD + list
├── useAnalytics() → Computed statistics
├── useDashboard() → RPC aggregations
├── useDevices() → Device management
├── useQueries() → Support tickets
└── useMessages() → Messaging

        ↓ (State setters)

SCREENS (React Components)
├── DashboardScreen → Display KPIs, chart, schedule
├── AnalyticsScreen → Display metrics, charts
├── ClientManagementScreen → Client CRUD, grid view
├── SessionHistoryScreen → Session list, filtering
├── DeviceControlsScreen → Device management
├── QueryManagementScreen → Support tickets
├── CommunicationHubScreen → Messaging UI
└── AIAssistantScreen → Chat interface

        ↓ (UI components)

UI COMPONENTS (Feature-less presentation)
├── StatCard, Card, Badge, Avatar
├── BarChart, LineChart, PieChart
├── Button, Input, Modal, SearchBar
└── ProgressBar, FilterTabs, NotificationPanel
```

---

### 2.3 Real-time Updates Pattern

**All hooks use Supabase Postgres real-time subscriptions:**

```typescript
useEffect(() => {
  fetchData(); // Initial fetch

  const subscription = supabase
    .channel("table-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "clients" },
      (payload) => {
        // Re-fetch or update state
        fetchData();
      },
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

This means:

- Clients list updates when any client is created/updated/deleted
- Sessions update in real-time
- Messages arrive instantly
- Devices status updates live

---

## 3. BUSINESS LOGIC & CALCULATIONS

### 3.1 Risk Scoring Algorithm (identifyRiskClients)

**Risk Assessment Logic:**

```
For each client:
  riskLevel = 'low' (default)
  reasons = []

  IF adherence < 50%:
    → ADD "Low adherence rate"
    → SET riskLevel = 'high'
  ELSE IF adherence < 70%:
    → ADD "Moderate adherence concerns"
    → SET riskLevel = 'medium'

  IF progress < 30%:
    → ADD "Minimal progress"
    → SET riskLevel = 'high'
  ELSE IF progress < 50%:
    → ADD "Below average progress"
    → SET riskLevel = 'medium' (if not high)

  IF status = 'Inactive':
    → ADD "Inactive status"
    → SET riskLevel = 'high'

  IF last_active = 'Never':
    → ADD "Never attended session"
    → SET riskLevel = 'high'

  IF change < -3%:
    → ADD "Declining progress trend"
    → SET riskLevel = 'medium' (if not high)

RETURN: clients filtered to riskLevel != 'low', sorted by (high, medium, low)
```

**Output Example:**

```typescript
{
  clientId: 'c1000000-0000-0000-0000-000000000011',
  clientName: 'Sneha Desai',
  riskLevel: 'high',
  reasons: ['Low adherence rate', 'Minimal progress', 'Inactive status'],
  lastActive: '2 weeks ago'
}
```

---

### 3.2 Analytics Calculations

#### Client Statistics

```typescript
• total = clients.length
• active = count(status='Active')
• inactive = count(status='Inactive')
• avgProgress = SUM(progress) / count
• avgAdherence = SUM(adherence) / count
• byProfileType = GROUP BY profile_type
```

#### Session Statistics

```typescript
• total = sessions.length
• completed = count(status='Completed')
• scheduled = count(status='Scheduled')
• cancelled = count(status='Cancelled')
• completionRate = (completed / total) × 100
• avgProgress = SUM(progress where completed) / completedCount
```

#### Therapy Outcomes (by Therapy Type)

```typescript
FOR each completed session GROUP BY therapy_type:
  • avgProgress = AVERAGE(session.progress)
  • sessionsCount = COUNT(sessions)
  • successRate = COUNT(progress > 70%) / total × 100
```

#### Device Statistics

```typescript
• total = devices.length
• connected = count(status='Connected')
• standby = count(status='Standby')
• offline = count(status='Offline')
• connectionRate = (connected + standby) / total × 100
```

#### Therapist Performance Ranking

```typescript
FOR each therapist:
  • clientsCount = COUNT(DISTINCT client_id)
  • completedSessions = COUNT(sessions WHERE status='Completed')
  • avgClientProgress = AVG(client.progress)
  • avgSessionProgress = AVG(session.progress)

SORT BY completedSessions DESC
```

#### Monthly Growth Trends

```typescript
FOR each month:
  • activeClients = COUNT(DISTINCT client_id)
  • completedSessions = COUNT(sessions WHERE status='Completed')
  • newClients = COUNT(clients created in month)

SORT BY month ASC
GROUP BY (YYYY-MM)
```

---

### 3.3 Data Transformation Patterns

#### Client Distribution for Pie Chart

```typescript
// Transform from flat client list to chart format
clientDistribution = Object.entries(
  clients.reduce((acc, c) => {
    acc[c.profile_type] = (acc[c.profile_type] || 0) + 1
    return acc
  }, {})
).map(([label, value], i) => ({
  label,
  value,
  color: colors[i % colors.length]
}))

// Result:
[
  { label: 'Orthopedic', value: 4, color: '#e84d6a' },
  { label: 'Cardiac', value: 2, color: '#3b82f6' },
  { label: 'Sports Medicine', value: 2, color: '#10b981' },
]
```

#### Session Trends Timeline

```typescript
// Transform sessions into monthly bar chart
monthlyMap = {};
sessions.forEach((s) => {
  const month = new Date(s.date).toLocaleDateString("en", { month: "short" });
  if (!monthlyMap[month]) monthlyMap[month] = { scheduled: 0, completed: 0 };
  if (s.status === "Completed") monthlyMap[month].completed++;
  else monthlyMap[month].scheduled++;
})[
  // Result:
  {
    label: "Jan",
    values: [
      { value: 12, color: "#3b82f6", label: "Scheduled" },
      { value: 10, color: "#10b981", label: "Completed" },
    ],
  }
];
```

#### Client Search Filtering

```typescript
// Full-text-like search across multiple fields
const results = clients.filter(
  (c) =>
    c.name.toLowerCase().includes(query) ||
    c.email.toLowerCase().includes(query) ||
    c.phone.includes(query),
);

// Or via Supabase:
supabase
  .from("clients")
  .select("*")
  .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`);
```

---

## 4. TEST DATA & DUMMY DATA PATTERNS

### 4.1 Dummy Data Structure

**Location:** `supabase/seed.sql`

**Dataset includes:**

#### Therapists (4 profiles)

```
1. Dr. Rajesh Sharma (admin) - t1000000-0000-0000-0000-000000000001
2. Dr. Neha Patel (therapist) - t1000000-0000-0000-0000-000000000002
3. Dr. Priya Singh (therapist) - t1000000-0000-0000-0000-000000000003
4. SmartHeal Support (support) - t1000000-0000-0000-0000-000000000004
```

#### Clients (12 samples)

```
• Priya Sharma: Orthopedic, 85% progress, 95% adherence, Active
• Arjun Patel: Sports Medicine, 62% progress, 85% adherence, Active
• Vikram Reddy: Neurological, 72% progress, 88% adherence, Active
• Ananya Iyer: Cardiac, 55% progress, 70% adherence, Active
• Kavya Menon: Orthopedic, 35% progress, 60% adherence, Inactive ✗ RISK
• Sneha Desai: General, 20% progress, 40% adherence, Inactive ✗ HIGH RISK
• ... (6 more with varying progress 20-95%, adherence 40-99%)
```

#### Sessions (25 samples)

```
• Status mix: 18 Completed, 4 Scheduled, 3 Cancelled
• Therapy types: EMS, Ultrasound, Cardiac Rehab, Neurostimulation, TENS
• Date range: Jan 2026 - Mar 2026
• Progress: 60-95% for completed sessions
```

#### Support Queries (6 samples)

```
• Device connectivity issues
• Billing inquiries
• Protocol adjustments
• Device firmware updates
```

#### Devices (6 samples)

```
• Status: 4 Connected, 1 Standby, 1 Offline
• Types: Ultrasound, Neurostimulation, EMS, TENS, Cardiac Monitor
```

#### Analytics Events (20 samples)

```
• Event types: login, signup
• Tracking user engagement over time
```

---

### 4.2 Demo Data in Components

**Demo Schedule (DashboardScreen):**

```typescript
const DEMO_SCHEDULE = [
  { name: 'Priya Sharma', type: 'ITT Therapy', time: '10:00 AM', color: '#d4183d' },
  { name: 'Arjun Patel', type: 'Recovery Session', time: '11:30 AM', color: '#d4183d' },
  ...
]
```

**Demo Chart Data (if no real data):**

```typescript
const DEMO_CHART_DATA = [
  { label: 'Mon', values: [
    { value: 24, color: '#d4183d' },
    { value: 20, color: '#10b981' }
  ]},
  ...
]
```

**Demo Notifications (useNotifications):**

```typescript
{
  id: 'n1',
  title: 'Session Completed',
  message: 'Priya Sharma completed her Ultrasound Therapy session with 85% progress.',
  type: 'success',
  read: false,
  timestamp: Date,
  action: 'sessions'
},
...
```

---

### 4.3 Sample Analytics Output

**Expected values from dummy data:**

```typescript
SAMPLE_CLIENT_STATS = {
  total: 12,
  active: 9,
  inactive: 3,
  avgProgress: 65%,
  avgAdherence: 79%,
  byProfileType: {
    'Orthopedic': 4,
    'Cardiac': 2,
    'Sports Medicine': 2,
    'Neurological': 2,
    'General': 2
  }
}

SAMPLE_SESSION_STATS = {
  total: 25,
  completed: 18,
  scheduled: 4,
  cancelled: 3,
  completionRate: 72%,
  avgProgress: 82%
}

SAMPLE_THERAPIST_PERFORMANCE = [
  {
    therapistName: 'Dr. Neha Patel',
    clientsCount: 8,
    completedSessions: 13,
    avgClientProgress: 76%,
    avgSessionProgress: 85%
  },
  {
    therapistName: 'Dr. Rajesh Sharma',
    clientsCount: 5,
    completedSessions: 8,
    avgClientProgress: 63%,
    avgSessionProgress: 71%
  }
]

SAMPLE_AT_RISK_CLIENTS = [
  {
    clientName: 'Sneha Desai',
    riskLevel: 'high',
    reasons: ['Low adherence (40%)', 'Minimal progress (20%)', 'Inactive status'],
    lastActive: '2 weeks ago'
  },
  ...
]
```

---

## 5. SCREENS & DATA TRANSFORMATION

### 5.1 Screen Hierarchy & Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                  App Navigation (_layout)                 │
│    Routes: Dashboard | Clients | Sessions | Analytics    │
│           | Devices | Communications | Queries            │
│           | Company | AI Assistant | Settings             │
└─────────────────────────────────────────────────────────┘

           ↓

┌─────────────────────────────────────────────────────────┐
│               DashboardScreen                             │
├─────────────────────────────────────────────────────────┤
│ Hook: useDashboard()                                      │
│ Input: stats, monthlyData, recentClients, todaysSchedule│
│ Transform:                                                │
│  • displayStats fallback to DEMO if no data              │
│  • chartData from monthlyData or DEMO_CHART_DATA         │
│  • schedule from todaysSchedule or DEMO_SCHEDULE         │
│ Output: StatCards, BarChart, ScheduleList, ClientsTable │
└─────────────────────────────────────────────────────────┘
```

### 5.2 DashboardScreen Data Transformation

**Input Data:**

```typescript
const { stats, monthlyData, recentClients, todaysSchedule, loading, refresh } =
  useDashboard();
```

**Transformations:**

```typescript
// 1. Fallback demo stats if no real data
const displayStats = {
  total_clients: stats.total_clients || 127, // Demo: 127
  active_sessions: stats.active_sessions || 43, // Demo: 43
  completion_rate: stats.completion_rate || 78, // Demo: 78%
  total_devices: stats.total_devices || 89, // Demo: 89
};

// 2. Chart data: monthlyData → BarChart format
const chartData =
  monthlyData.length > 0
    ? monthlyData.map((d) => ({
        label: d.month, // 'Jan', 'Feb', etc.
        values: [
          { value: d.scheduled, color: "#d4183d" },
          { value: d.completed, color: "#10b981" },
        ],
      }))
    : DEMO_CHART_DATA;

// 3. Schedule: todaysSchedule or demo
const schedule = todaysSchedule.length > 0 ? todaysSchedule : DEMO_SCHEDULE;

// 4. Client table: recentClients → table rows
```

**Output Rendering:**

```
Welcome Banner
 ↓
4 StatCards (Total Clients, Active Sessions, Avg Progress, This Week)
 ↓
BarChart (Client Activity - scheduled vs completed)
 ↓
Schedule List (Today's sessions)
 ↓
Client Table (Recent clients with progress bars)
```

---

### 5.3 AnalyticsScreen Data Transformation

**Input Data:**

```typescript
const {
  clientDistribution,
  sessionTrends,
  therapyOutcomes,
  growthData,
  loading,
  refresh,
} = useAnalytics();
const { stats } = useDashboard();
```

**Transformations:**

```typescript
// 1. Chart data from hooks (already formatted)
lineChart.data = growthData || DEMO_GROWTH
pieChart.data = clientDistribution || [{Athlete: 52, Health: 43, Coach: 32}]
barChart1.data = therapyOutcomes || DEMO_OUTCOMES
barChart2.data = sessionTrends || DEMO_WEEKLY

// 2. Stat cards from dashboard stats
StatCard values: total_clients, active_sessions, completion_rate, total_devices

// 3. Performance summary (hard-coded demo)
Client Satisfaction: 4.8/5.0
Treatment Success: 91%
Client Retention: 96%
```

**Output Rendering:**

```
Header with Export button
 ↓
4 StatCards
 ↓
Row 1: Growth Trends (LineChart) + Client Distribution (PieChart)
 ↓
Row 2: Therapy Outcomes (BarChart) + Weekly Distribution (BarChart)
 ↓
Performance Summary (3 metrics boxes)
```

---

### 5.4 ClientManagementScreen Data Transformation

**Input Data:**

```typescript
const {
  clients,
  loading,
  stats,
  searchClients,
  createClient,
  updateClient,
  deleteClient,
} = useClients();
```

**Transformations:**

```typescript
// 1. Stats compute
avgAdherence = clients.reduce((sum, c) => sum + c.adherence, 0) / clients.length

// 2. Grid layout based on screen size
cardWidth = isMobile ? '100%' : columns >= 3 ? '31.5%' : '48%'

// 3. Client card transformation
for each client:
  • Avatar: client.avatar_color
  • Header: name, profile_type, status badge
  • Info: email, phone icons
  • Progress bar: client.progress %
  • Metrics: sessions count, adherence %
  • Footer: last_active, trend (change value)

// 4. Status badge color mapping
status === 'Active' ? 'success' (green) : 'warning' (yellow)

// 5. Trend display
change >= 0 ? '↑' (green) : '↓' (red)
```

**Output Rendering:**

```
Header + Search bar
 ↓
4 StatCards (Total, Active, Avg Progress, Avg Adherence)
 ↓
Client Grid: Cards with all above info
 ↓
Modal for Add Client
```

---

### 5.5 SessionHistoryScreen Data Transformation

**Input Data:**

```typescript
const { sessions, loading, stats, filterSessions, createSession } =
  useSessions();
```

**Transformations:**

```typescript
// 1. Filter tabs
activeFilter → filterSessions(tab) → re-fetch matching sessions

// 2. Stats summary
thisWeek = count(sessions within last 7 days)

// 3. Session card transformation
for each session:
  • Avatar: generated from therapy_type mapping
  • Name mappings: CLIENT_NAMES[therapy_type]
  • Status badge: Completed (green) | Scheduled (blue) | Cancelled (red)
  • Meta: date (calendar icon), time (clock icon), duration (activity icon)
  • Priority badge: based on progress
    - progress >= 75% → 'High' (red)
    - progress >= 50% → 'Medium' (yellow)
    - progress < 50% → 'Low' (green)
  • Session notes: if completed and has notes

// 4. Priority mapping
HIGH priority: progress >= 75%
MEDIUM priority: progress >= 50%
LOW priority: progress < 50%
```

**Output Rendering:**

```
Header + Export button
 ↓
4 StatCards (Total, Completed, Scheduled, This Week)
 ↓
FilterTabs (All | Completed | Scheduled | Cancelled)
 ↓
Session List: Card per session with status, date, time, priority
 ↓
Modal for Add Session
```

---

## 6. CRITICAL BUSINESS RULES SUMMARY

### 6.1 Risk Identification Logic

| Metric      | Threshold    | Risk Level |
| ----------- | ------------ | ---------- |
| Adherence   | < 50%        | HIGH       |
| Adherence   | 50-70%       | MEDIUM     |
| Progress    | < 30%        | HIGH       |
| Progress    | 30-50%       | MEDIUM     |
| Status      | Inactive     | HIGH       |
| Last Active | Never        | HIGH       |
| Trend       | < -3% change | MEDIUM     |

**At-risk clients** are flagged with reasons and sorted by severity.

---

### 6.2 Session Status Lifecycle

```
Scheduled → In Progress → Completed (with progress %)
     ↘
      → Cancelled (no progress)
```

**Key metrics derived from sessions:**

- Completion rate = (Completed / Total) × 100
- Average progress from completed sessions only
- Therapy outcome success = % of sessions with > 70% progress

---

### 6.3 Therapist Performance Ranking

**Ranking criteria (in order):**

1. Number of completed sessions (primary sort)
2. Average client progress
3. Average session progress
4. Number of active clients

**Use case:** Identify top performers and those needing support.

---

### 6.4 Device Connection Metrics

```
Connection Rate = (Connected + Standby) / Total × 100

Statuses:
- Connected: 100% operational
- Standby: Available but not in use
- Offline: Not communicating
```

---

## 7. KEY DATA PATTERNS & INSIGHTS

### 7.1 From Sample Data (12 clients, 25 sessions)

**Expected Analytics Output:**

| Metric            | Value          | Source                          |
| ----------------- | -------------- | ------------------------------- |
| Total Clients     | 12             | Direct count                    |
| Active Clients    | 9              | status='Active' count           |
| Avg Progress      | 65%            | Aggregate of all clients        |
| Avg Adherence     | 79%            | Aggregate of all clients        |
| Completion Rate   | 72%            | (18 completed / 25 total)       |
| Device Connection | 83.3%          | (5 connected/standby / 6 total) |
| Top Therapist     | Dr. Neha Patel | 13 completed sessions           |
| At-risk Count     | 3-4 clients    | riskLevel != 'low'              |

---

### 7.2 Data Relationships

```
therapists (1) ──→ (n) clients
              ↓
         (n) sessions

clients (1) ──→ (n) sessions
        ↓
      (n) queries

therapists (1) ──→ (n) queries (assigned_to)
therapists (1) ──→ (n) messages

clients (1) ──→ (n) messages (participants in communications)

devices (1) ──→ (n) queries (device_info references)
```

---

## APPENDIX: Integration Checklist

- [x] Hooks retrieve data from Supabase
- [x] Real-time subscriptions for live updates
- [x] Risk scoring algorithm identifies at-risk clients
- [x] Analytics calculations aggregate stats
- [x] Screens transform data for display
- [x] Demo data patterns established
- [x] Dummy data seeds sample dataset
- [x] Charts format data (pie, bar, line)
- [x] Fallback demo data when no real data
- [x] Auth protects all routes
- [x] Responsive layout for mobile/desktop
