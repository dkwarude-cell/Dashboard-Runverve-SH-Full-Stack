# Frontend Codebase Quick Reference Guide

## 1. HOOKS AT A GLANCE

### Core Data Hooks

```typescript
// 1. useAnalytics() - All dashboard metrics & risk analysis
import { useAnalytics } from '@/hooks/useAnalytics';
const {
  clientStats,           // {total, active, inactive, avgProgress, avgAdherence, byProfileType}
  sessionStats,          // {total, completed, scheduled, cancelled, completionRate, avgProgress}
  therapistPerformance,  // [{therapistName, clientsCount, completedSessions, avgClientProgress}]
  riskClients,           // [{clientName, riskLevel, reasons[], lastActive}]
  clientDistribution,    // Chart: [{label, value, color}]
  sessionTrends,         // Chart: [{label, values: [{value, color, label}]}]
  therapyOutcomes,       // Chart: [{label, values: [{value, color}]}]
  growthData,            // Chart: [{label, values}]
  loading
} = useAnalytics();


// 2. useDashboard() - KPI aggregations
import { useDashboard } from '@/hooks/useDashboard';
const {
  stats: { total_clients, active_sessions, completion_rate, total_devices },
  monthlyData,           // [{month, scheduled, completed}]
  recentClients,         // Last 5 clients
  todaysSchedule,        // Today's scheduled sessions
  loading,
  refresh: async () => {}
} = useDashboard();


// 3. useClients() - Full CRUD + search
import { useClients } from '@/hooks/useClients';
const {
  clients,               // Full client array
  stats: { total, active, inactive, avgProgress },
  fetchClients,
  createClient: async (client) => {},
  updateClient: async (id, updates) => {},
  deleteClient: async (id) => {},
  searchClients: async (query) => {}  // Full-text search
} = useClients();


// 4. useSessions() - Session management
import { useSessions } from '@/hooks/useSessions';
const {
  sessions,
  stats: { total, completed, scheduled, cancelled },
  fetchSessions,
  createSession: async (session) => {},
  updateSession: async (id, updates) => {},
  filterSessions: async (status) => {}  // 'All' or specific status
} = useSessions();


// 5. useDevices() - Device control
import { useDevices } from '@/hooks/useDevices';
const {
  devices,
  stats: { total, connected, standby, offline },
  fetchDevices,
  updateDevice: async (id, updates) => {}
} = useDevices();


// 6. useQueries() - Support tickets
import { useQueries } from '@/hooks/useQueries';
const {
  queries,
  responses,             // Grouped by query_id
  fetchResponses: async (queryId) => {},
  createQuery: async (query) => {},
  updateQuery: async (id, updates) => {},
  addResponse: async (response) => {}
} = useQueries();


// 7. useMessages() - Messaging
import { useMessages } from '@/hooks/useMessages';
const {
  contacts,              // List of other profiles
  messages,              // Grouped by contact_id
  fetchMessages: async (contactId) => {},
  sendMessage: async (receiverId, content) => {}
} = useMessages();


// 8. useAIChat() - AI assistant
import { useAIChat } from '@/hooks/useAIChat';
const {
  chatHistory,           // [{id, role, content, timestamp, error}]
  isThinking,
  sendMessage: async (userMessage, context?, attachments?) => {},
  clearChat: () => {}
} = useAIChat();


// 9. useNotifications() - In-app alerts
import { useNotifications } from '@/hooks/useNotifications';
const {
  notifications,         // Demo data + added notifications
  unreadCount,
  markAsRead: (id) => {},
  markAllAsRead: () => {},
  dismissNotification: (id) => {},
  addNotification: (notification) => {}
} = useNotifications();


// 10. useResponsive() - Responsive layout
import { useResponsive } from '@/hooks/useResponsive';
const {
  width, height,
  isMobile,              // width < 768px
  isTablet,              // 768px - 1024px
  isDesktop,             // 1024px - 1280px
  isLargeDesktop,        // > 1280px
  columns                // Grid columns (1-4)
} = useResponsive();
```

---

## 2. DATA TRANSFORMATION PATTERNS

### Transform Client List to Stats

```typescript
const stats = {
  total: clients.length,
  active: clients.filter((c) => c.status === "Active").length,
  inactive: clients.filter((c) => c.status === "Inactive").length,
  avgProgress: clients.length
    ? Math.round(
        clients.reduce((sum, c) => sum + c.progress, 0) / clients.length,
      )
    : 0,
};
```

### Transform Sessions to Monthly Chart

```typescript
const monthlyMap = {};
sessions.forEach((s) => {
  const month = new Date(s.date).toLocaleDateString("en", { month: "short" });
  if (!monthlyMap[month]) monthlyMap[month] = { scheduled: 0, completed: 0 };
  if (s.status === "Completed") monthlyMap[month].completed++;
  else monthlyMap[month].scheduled++;
});

const chartData = Object.entries(monthlyMap).map(([month, data]) => ({
  label: month,
  values: [
    { value: data.scheduled, color: "#d4183d", label: "Scheduled" },
    { value: data.completed, color: "#10b981", label: "Completed" },
  ],
}));
```

### Transform Clients by Profile Type (Pie Chart)

```typescript
const clientDistribution = Object.entries(
  clients.reduce((acc, c) => {
    acc[c.profile_type] = (acc[c.profile_type] || 0) + 1;
    return acc;
  }, {}),
).map(([label, value], i) => ({
  label,
  value,
  color: colors[i % colors.length],
}));
```

### Calculate Therapy Success Rate

```typescript
const completedSessions = sessions.filter((s) => s.status === "Completed");
const successCount = completedSessions.filter((s) => s.progress > 70).length;
const successRate = completedSessions.length
  ? Math.round((successCount / completedSessions.length) * 100)
  : 0;
```

---

## 3. BUSINESS RULES (COPY-PASTE REFERENCE)

### Risk Scoring for At-Risk Clients

```typescript
const clientRisk = [];
for (const client of clients) {
  const reasons = [];
  let riskLevel = "low";

  // Adherence checks
  if (client.adherence < 50) {
    reasons.push("Low adherence rate");
    riskLevel = "high";
  } else if (client.adherence < 70) {
    reasons.push("Moderate adherence concerns");
    riskLevel = "medium";
  }

  // Progress checks
  if (client.progress < 30) {
    reasons.push("Minimal progress");
    riskLevel = "high";
  } else if (client.progress < 50) {
    reasons.push("Below average progress");
    if (riskLevel === "low") riskLevel = "medium";
  }

  // Status checks
  if (client.status === "Inactive") {
    reasons.push("Inactive status");
    riskLevel = "high";
  }
  if (client.last_active === "Never") {
    reasons.push("Never attended session");
    riskLevel = "high";
  }

  // Trend check
  if (client.change < -3) {
    reasons.push("Declining progress trend");
    if (riskLevel === "low") riskLevel = "medium";
  }

  // Only include non-low risk
  if (riskLevel !== "low") {
    clientRisk.push({
      clientId: client.id,
      clientName: client.name,
      riskLevel,
      reasons,
      lastActive: client.last_active,
    });
  }
}

// Sort by severity
clientRisk.sort((a, b) => {
  const order = { high: 0, medium: 1, low: 2 };
  return order[a.riskLevel] - order[b.riskLevel];
});
```

### Session Priority Classification

```typescript
const getPriority = (sessionProgress) => {
  if (sessionProgress >= 75) return { level: "High", color: "#ef4444" };
  if (sessionProgress >= 50) return { level: "Medium", color: "#f59e0b" };
  return { level: "Low", color: "#10b981" };
};
```

### Connection Rate Calculation

```typescript
const connectionRate =
  devices.length > 0
    ? Math.round(
        ((devices.filter((d) => d.status === "Connected").length +
          devices.filter((d) => d.status === "Standby").length) /
          devices.length) *
          100 *
          10,
      ) / 10
    : 0;
```

### Completion Rate Calculation

```typescript
const completionRate =
  sessions.length > 0
    ? Math.round(
        (sessions.filter((s) => s.status === "Completed").length /
          sessions.length) *
          100 *
          10,
      ) / 10
    : 0;
```

---

## 4. SCREEN COMPONENT CHECKLIST

### DashboardScreen

- [ ] useDashboard() for KPIs
- [ ] StatCards (4: clients, sessions, progress, devices)
- [ ] BarChart for session trends
- [ ] Schedule list for today
- [ ] Recent clients table
- [ ] Fallback demo data if no real data
- [ ] Refresh control

### AnalyticsScreen

- [ ] useAnalytics() for all metrics
- [ ] 4 StatCards (total clients, sessions/month, completion rate, pain reduction)
- [ ] Line chart for growth trends
- [ ] Pie chart for client distribution
- [ ] Bar charts for therapy outcomes and weekly distribution
- [ ] Performance summary box
- [ ] Export button
- [ ] Fallback demo data

### ClientManagementScreen

- [ ] useClients() with search
- [ ] 4 StatCards (total, active, avg progress, avg adherence)
- [ ] SearchBar + FilterDropdown
- [ ] Client cards grid (responsive)
- [ ] Each card shows: name, type, email, phone, progress bar, sessions, adherence, status badge, trend
- [ ] Click to select/edit
- [ ] Add client modal with CRUD
- [ ] Delete confirmation

### SessionHistoryScreen

- [ ] useSessions() with filtering
- [ ] 4 StatCards (total, completed, scheduled, this week)
- [ ] FilterTabs (All, Completed, Scheduled, Cancelled)
- [ ] Session cards with: client, type, status badge, date, time, duration, priority badge, notes
- [ ] Export button
- [ ] Add session modal

### DeviceControlsScreen

- [ ] useDevices()
- [ ] 4 StatCards (total, connected, standby, offline) + connection rate
- [ ] Device cards with status indicator
- [ ] Battery level indicator
- [ ] Last sync timestamp
- [ ] Update status modal

### QueryManagementScreen

- [ ] useQueries()
- [ ] Filter by priority/status
- [ ] Query cards with:
  - Title, description
  - Priority badge (Critical/High/Medium/Low)
  - Status (New/Open/In Progress/Closed)
  - Assigned to
  - Response count
- [ ] Click to expand responses (threaded)
- [ ] Add response modal
- [ ] Create new query modal
- [ ] Export button

---

## 5. DUMMY DATA REFERENCE

### Sample Clients (for testing)

```json
{
  "count": 12,
  "active": 9,
  "avgProgress": 65,
  "avgAdherence": 79,
  "therapyTypes": [
    "Orthopedic",
    "Cardiac",
    "Sports Medicine",
    "Neurological",
    "General"
  ]
}
```

### Sample Sessions (for testing)

```json
{
  "count": 25,
  "completed": 18,
  "scheduled": 4,
  "cancelled": 3,
  "completionRate": 72,
  "avgProgress": 82
}
```

### Sample Therapists (for testing)

```json
{
  "Dr. Neha Patel": {
    "clients": 8,
    "completedSessions": 13,
    "avgProgress": 76
  },
  "Dr. Rajesh Sharma": {
    "clients": 5,
    "completedSessions": 8,
    "avgProgress": 63
  },
  "Dr. Priya Singh": { "clients": 3, "completedSessions": 5, "avgProgress": 48 }
}
```

### Sample Demo User

```json
{
  "email": "admin@smartheal.io",
  "name": "Dr. SmartHeal Admin",
  "role": "admin"
}
```

---

## 6. REAL-TIME SUBSCRIPTION TEMPLATE

```typescript
useEffect(() => {
  // Initial fetch
  fetchData();

  // Real-time subscription
  const subscription = supabase
    .channel("table-changes")
    .on(
      "postgres_changes",
      {
        event: "*", // 'INSERT' | 'UPDATE' | 'DELETE' | '*'
        schema: "public",
        table: "table_name",
      },
      (payload) => {
        console.log("Change received!", payload);
        // Re-fetch or update local state
        fetchData();
      },
    )
    .subscribe();

  // Cleanup
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

---

## 7. COMMON COMPONENT PATTERNS

### Use Analytics Data

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

export default function MyScreen() {
  const { clientStats, sessionStats, riskClients, loading } = useAnalytics();

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Text>Total Clients: {clientStats?.total}</Text>
      <Text>Completion Rate: {sessionStats?.completionRate}%</Text>
      {riskClients.map(client => (
        <Text key={client.clientId}>
          {client.clientName}: {client.riskLevel}
        </Text>
      ))}
    </View>
  );
}
```

### Use Search with Clients

```typescript
import { useClients } from '@/hooks/useClients';

export default function SearchScreen() {
  const { clients, searchClients } = useClients();
  const [query, setQuery] = useState('');

  return (
    <>
      <SearchBar
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          searchClients(text);  // Real-time search
        }}
      />
      {clients.map(client => (
        <ClientCard key={client.id} client={client} />
      ))}
    </>
  );
}
```

### Use Filter with Sessions

```typescript
import { useSessions } from '@/hooks/useSessions';

export default function FilteredSessions() {
  const { sessions, filterSessions } = useSessions();

  return (
    <FilterTabs
      tabs={['All', 'Completed', 'Scheduled', 'Cancelled']}
      onTabChange={(tab) => filterSessions(tab)}
    />
  );
}
```

---

## 8. KEY FILE LOCATIONS

| File                                             | Purpose                     |
| ------------------------------------------------ | --------------------------- |
| `/hooks/useAnalytics.ts`                         | Metrics & risk calculations |
| `/hooks/useDashboard.ts`                         | KPI aggregations            |
| `/hooks/useClients.ts`                           | Client CRUD & search        |
| `/hooks/useSessions.ts`                          | Session CRUD & filtering    |
| `/lib/analytics.ts`                              | Calculation functions       |
| `/lib/auth.tsx`                                  | Auth context provider       |
| `/lib/supabase.ts`                               | Supabase client config      |
| `/components/screens/DashboardScreen.tsx`        | Main dashboard              |
| `/components/screens/AnalyticsScreen.tsx`        | Analytics dashboard         |
| `/components/screens/ClientManagementScreen.tsx` | Client CRUD UI              |
| `/components/screens/SessionHistoryScreen.tsx`   | Session management          |
| `/supabase/schema.sql`                           | Database schema             |
| `/supabase/seed.sql`                             | Dummy data                  |

---

## 9. API RESPONSE TYPES

### Client Object

```typescript
{
  id: string (UUID)
  name: string
  email: string
  phone: string
  avatar_color: string (hex)
  progress: number (0-100)
  sessions: number
  adherence: number (0-100)
  last_active: string
  change: number (trend)
  status: 'Active' | 'Inactive'
  profile_type: string
  therapist_id: UUID
  notes: string
  created_at: ISO string
  updated_at: ISO string
}
```

### Session Object

```typescript
{
  id: string (UUID)
  client_id: UUID
  therapist_id: UUID
  therapy_type: string
  date: string (YYYY-MM-DD)
  time: string (HH:MM)
  duration: string (e.g., "30 min")
  status: 'Completed' | 'Scheduled' | 'Cancelled' | 'In Progress'
  progress: number (0-100)
  notes: string
  created_at: ISO string
  updated_at: ISO string
}
```

### Device Object

```typescript
{
  id: string (UUID)
  name: string
  type: string
  status: 'Connected' | 'Standby' | 'Offline'
  battery_level: number
  last_sync: ISO string
  firmware_version: string
  created_at: ISO string
  updated_at: ISO string
}
```

---

## 10. COMMON ERRORS & FIXES

| Error                                                       | Cause                   | Fix                                                               |
| ----------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------- |
| "Undefined is not an object (evaluating 'statsData.total')" | Data not loaded yet     | Check `loading` state, use optional chaining (`stats?.total`)     |
| "Cannot read property 'map' of undefined"                   | Array is null/undefined | Use `chartData.filter(Boolean)` or check length first             |
| Chart shows no data                                         | Using old data format   | Ensure data matches `{label, value, color}[]` format              |
| Search returns no results                                   | Supabase policy issue   | Check RLS policies in database, use `ilike` not exact match       |
| Real-time updates not working                               | Subscription not active | Ensure provider wraps app, check channel name matches table       |
| "User not authenticated"                                    | Auth not initialized    | Wrap screens in AuthProvider, use `useAuth()` in protected routes |
