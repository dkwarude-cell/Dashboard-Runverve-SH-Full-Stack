# Visual Data Flow & Architecture Reference

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SMARTHEAL SYSTEM ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────┐                                                        │
│  │  React Native    │                                                        │
│  │  Frontend        │                                                        │
│  │  (Expo Dev)      │  Port: 8082                                           │
│  └────────┬─────────┘                                                        │
│           │                                                                   │
│           │ HTTP / REST API calls                                            │
│           │                                                                   │
│  ┌────────▼──────────────────────────────────────────┐                       │
│  │    Express.js Backend Server                      │  Port: 3000           │
│  │  ┌──────────────────────────────────────────────┐ │                       │
│  │  │ Routes Layer                                 │ │                       │
│  │  │ ├─ /api/v1/users                            │ │                       │
│  │  │ ├─ /api/v1/clients                          │ │                       │
│  │  │ ├─ /api/v1/therapists                       │ │                       │
│  │  │ ├─ /api/v1/sessions                         │ │                       │
│  │  │ └─ /api/v1/analytics  ◄── (NEW)             │ │                       │
│  │  └──────────┬───────────────────────────────────┘ │                       │
│  │  ┌──────────▼───────────────────────────────────┐ │                       │
│  │  │ Controllers Layer                            │ │                       │
│  │  │ ├─ userController                           │ │                       │
│  │  │ ├─ clientController                         │ │                       │
│  │  │ ├─ therapistController                      │ │                       │
│  │  │ ├─ sessionController                        │ │                       │
│  │  │ └─ analyticsController  ◄── (NEW)           │ │                       │
│  │  └──────────┬───────────────────────────────────┘ │                       │
│  │  ┌──────────▼───────────────────────────────────┐ │                       │
│  │  │ Services Layer                               │ │                       │
│  │  │ ├─ userService                              │ │                       │
│  │  │ ├─ clientService                            │ │                       │
│  │  │ ├─ therapistService                         │ │                       │
│  │  │ ├─ sessionService                           │ │                       │
│  │  │ └─ analyticsService  ◄── (NEW: 8 functions) │ │                       │
│  │  │                                              │ │                       │
│  │  │ Analytics Functions:                        │ │                       │
│  │  │ ├─ getDashboardAnalytics()                  │ │                       │
│  │  │ ├─ getClientStatistics()                    │ │                       │
│  │  │ ├─ getSessionStatistics()                   │ │                       │
│  │  │ ├─ getTherapyOutcomes()                     │ │                       │
│  │  │ ├─ getTherapistPerformance()                │ │                       │
│  │  │ ├─ getMonthlyGrowth()                       │ │                       │
│  │  │ ├─ getRiskAssessment()                      │ │                       │
│  │  │ └─ get[Client|Therapist]Analytics()         │ │                       │
│  │  └──────────┬───────────────────────────────────┘ │                       │
│  │  ┌──────────▼───────────────────────────────────┐ │                       │
│  │  │ Middleware Layer                             │ │                       │
│  │  │ ├─ authenticate()                           │ │                       │
│  │  │ ├─ rbac()                                    │ │                       │
│  │  │ └─ errorHandler()                           │ │                       │
│  │  └──────────┬───────────────────────────────────┘ │                       │
│  └─────────────┬──────────────────────────────────────┘                       │
│                │                                                              │
│                │ Knex Query Builder                                          │
│                │                                                              │
│  ┌─────────────▼──────────────────────┐                                      │
│  │  SQLite Database                   │                                      │
│  │  (smartheal.db)                    │                                      │
│  │                                    │                                      │
│  │  ┌────────────────────────────┐   │                                      │
│  │  │ users (17)                 │   │                                      │
│  │  │ ├─ id, firebase_uid        │   │                                      │
│  │  │ ├─ role, email             │   │                                      │
│  │  │ └─ timestamps              │   │                                      │
│  │  ├─ clients (12)              │   │                                      │
│  │  │ ├─ user_id ────┐           │   │                                      │
│  │  │ ├─ diagnosis   │           │   │                                      │
│  │  │ ├─ risk_score  │           │   │                                      │
│  │  │ └─ sessions    │           │   │                                      │
│  │  ├─ therapists (4)            │   │                                      │
│  │  │ ├─ user_id ────┐           │   │                                      │
│  │  │ ├─ rating      │           │   │                                      │
│  │  │ └─ capacity    │           │   │                                      │
│  │  ├─ sessions (79) │           │   │                                      │
│  │  │ ├─ client_id ──┘           │   │                                      │
│  │  │ ├─ therapist_id            │   │                                      │
│  │  │ ├─ status                  │   │                                      │
│  │  │ ├─ ratings                 │   │                                      │
│  │  │ └─ risk scores             │   │                                      │
│  │  └─ analytics (68)            │   │                                      │
│  │    ├─ user_id                 │   │                                      │
│  │    ├─ metric_type             │   │                                      │
│  │    ├─ metric_value            │   │                                      │
│  │    └─ metric_date             │   │                                      │
│  └────────────────────────────────┘   │                                      │
│                                        │                                      │
└────────────────────────────────────────┘                                      │
                                                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Analytics Data Flow Pipeline

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          ANALYTICS PIPELINE                                │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STEP 1: API Request                                                       │
│  ──────────────────────────────────────────────────────────────           │
│                                                                             │
│    Frontend                                                Backend          │
│    ┌─────────────────────────────┐                                         │
│    │ GET /api/v1/analytics/risk  │─────────────────────────────┐           │
│    └─────────────────────────────┘                             │           │
│                                                                 │           │
│  STEP 2: Route Matching                                         ▼           │
│  ──────────────────────────────────────────────────────────     │           │
│                                                                 ├──→ analyticsRoutes.js  │
│    Matching Pattern:                                            │           │
│    GET /api/v1/analytics/risk                                  │           │
│                          ▲                                     │           │
│                          │ Route matches                       │           │
│                          │                                     │           │
│                      router.get('/risk', authenticate,         │           │
│                        analyticsController.getRiskAssessment)  │           │
│                                                                 │           │
│  STEP 3: Authentication Middleware                             │           │
│  ──────────────────────────────────────────────────────────    │           │
│                                                                 ▼           │
│    ✓ Verify Bearer Token                                       │           │
│    ✓ Extract User ID                                        analyticsController    │
│    ✓ Check RBAC permissions                                    │           │
│    ✓ Pass to next middleware                                   │           │
│                                                                 │           │
│  STEP 4: Controller Execution                                  │           │
│  ──────────────────────────────────────────────────────────    │           │
│                                                                 ▼           │
│    getRiskAssessment(req, res) {                               │           │
│      analyticsService.getRiskAssessment()                  analyticsService    │
│    }                                                            │           │
│                                                                 │           │
│  STEP 5: Service Layer - Database Queries                      │           │
│  ──────────────────────────────────────────────────────────    ▼           │
│                                                                 │           │
│    getRiskAssessment() {                                        │           │
│                                                                 │           │
│      Query 1: Get at-risk clients                             │           │
│      ─────────────────────────────────────                    │           │
│      clients                                                    │           │
│        .select(...)      ┐                                         │           │
│        .join(users)      ├─→ WHERE risk_score > 3.5            │           │
│        .where(...)       │                                         │           │
│        .orderBy(...)     ┘                                         │           │
│                          ▼                                         │           │
│      ┌────────────────────────────────────┐                     │           │
│      │ Result: 3 at-risk clients found    │                     │           │
│      ├────────────────────────────────────┤                     │           │
│      │ • John Smith (risk: 4.35)          │                     │           │
│      │ • Emily Johnson (risk: 3.78)       │                     │           │
│      │ • Robert Brown (risk: 3.92)        │                     │           │
│      └────────────────────────────────────┘                     │           │
│                                                                 │           │
│      Query 2: Count low adherence indicators                   │           │
│      ──────────────────────────────────────                    │           │
│      clients                                                    │           │
│        .count()                                                 │           │
│        .where((completed/total) < 0.5)                         │           │
│      Result: 4 clients with low adherence                      │           │
│                                                                 │           │
│      Query 3: Count never attended                             │           │
│      ────────────────────────────────────   │           │
│      clients                                                    │           │
│        .count()                                                 │           │
│        .where('completed_sessions', 0)                         │           │
│      Result: 1 client never attended                           │           │
│                                                                 │           │
│      Query 4: Generate recommendations                         │           │
│      ─────────────────────────────────────                    │           │
│      Custom logic:                                              │           │
│      - If atRiskCount > 5: suggest group programs              │           │
│      - If neverAttended > 0: suggest outreach                  │           │
│      - If lowAdherence > 0: suggest barrier review             │           │
│                                                                 │           │
│  STEP 6: Response Formatting                                   │           │
│  ──────────────────────────────────────────────────────────   │           │
│                                                                 ▼           │
│    JSON Response:                                               │           │
│    ┌──────────────────────────────────────┐                    │           │
│    │ {                                    │                    │           │
│    │   "success": true,                   │                    │           │
│    │   "data": {                          │                    │           │
│    │     "atRiskCount": 3,                │                    │           │
│    │     "atRiskClients": [{...}],        │                    │           │
│    │     "riskIndicators": {...},         │                    │           │
│    │     "recommendations": [...]         │                    │           │
│    │   }                                  │                    │           │
│    │ }                                    │                    │           │
│    └──────────────────────────────────────┘                    │           │
│                                                                 │           │
│  STEP 7: Response Sent to Frontend                             │           │
│  ──────────────────────────────────────────────────────────   │           │
│                                                                 │           │
│    HTTP 200 OK + JSON                                          │           │
│    ────────────────────                                        │           │
│              ◄─────────────────────────────────────────────────┘           │
│                                                                             │
│    Frontend receives response and updates UI:                              │
│    ┌────────────────────────────────────────────────────┐                 │
│    │ Display:                                           │                 │
│    │ ┌──────────────────────────────────────────────┐  │                 │
│    │ │ ⚠️ 3 At-Risk Clients                         │  │                 │
│    │ ├──────────────────────────────────────────────┤  │                 │
│    │ │ • John Smith                                 │  │                 │
│    │ │   Risk Factors: Low adherence, High risk... │  │                 │
│    │ │   Last Session: 5 days ago                   │  │                 │
│    │ │   Action: [View Details] [Follow Up]         │  │                 │
│    │ │                                              │  │                 │
│    │ │ • Emily Johnson                              │  │                 │
│    │ │   Risk Factors: Low adherence, No recent...  │  │                 │
│    │ │   Last Session: 8 days ago                   │  │                 │
│    │ │   Action: [View Details] [Call Client]       │  │                 │
│    │ └──────────────────────────────────────────────┘  │                 │
│    └────────────────────────────────────────────────────┘                 │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Analytics Computation Functions Map

```
                    getRiskAssessment()
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        Get at-risk    Count low      Generate
        clients        adherence      recommendations
        (3)            (4)            (4 items)
              │            │            │
              └────────────┴────────────┘
                    │
                    ▼
            Combine & Format
                    │
                    ▼
              JSON Response


        getClientStatistics()
              │
    ┌─────────┼─────────┬──────────┐
    ▼         ▼         ▼          ▼
  Count   By Diagnosis  By Risk  At-Risk
  Total    Level        Count    Percentage
   │         │           │        │
   └─────────┴───────────┴────────┘
         │
         ▼
    JSON Response


        getTherapyOutcomes()
              │
    ┌─────────┼────────────┬────────────┐
    ▼         ▼            ▼            ▼
  Progress  Avg Rating   Rating Dist   Risk Improve
  Trends                               ment
    │         │            │            │
    └─────────┴────────────┴────────────┘
         │
         ▼
    JSON Response


    getDashboardAnalytics()
          │
    ┌─────┼───────┬──────────┬────────────┬────────────┬──────────┐
    ▼     ▼       ▼          ▼            ▼            ▼          ▼
  Client Session Therapy   Therapist    Monthly      Risk      Generated
  Stats  Stats   Outcomes  Performance  Growth       Assessment At: ISO8601
    │     │       │          │           │           │         │
    └─────┴───────┴──────────┴───────────┴───────────┴─────────┘
         │
         ▼
    Combined JSON Response
    with all metrics
```

---

## Database Join Diagram

```
                    users (17 records)
                         │
                ┌────────┼────────┐
                │        │        │
                ▼        ▼        ▼
              admin   therapists clients
              (1)       (4)       (12)
              │         │         │
              │         │         │
              │         │    ┌────┴─────┐
              │         │    │          │
              │         │    ▼          ▼
              │         │  risk_score   last_session_date
              │         │  diagnosis    completed_sessions
              │         │  addiction    total_sessions
              │         │
              │         └─→ analytics (68)
              │             per user
              │
              │            SESSIONS (79)
              │                 │
              │      ┌──────────┴──────────┐
              │      ▼                     ▼
              │   client_id          therapist_id
              │   (12 unique)        (4 unique)
              │      │                     │
              │      ├─────────────────────┘
              │      │
              │      └─→ Many-to-Many
              │          Relationship
              │          Example:
              │          Dr. Sarah (th-uuid1)
              │            ├─ John Smith (cl-uuid1): 5 sessions
              │            ├─ Emily Johnson (cl-uuid2): 3 sessions
              │            ├─ Robert Brown (cl-uuid3): 4 sessions
              │            └─ ... more sessions


        Sessions Data Used in Analytics:
        ─────────────────────────────────

        status ─────┐
        duration ───┤
        rating ─────├──→ Session Statistics
        date ───────┤
        notes ──────┘

        client_rating ──┐
        progress ───────├──→ Therapy Outcomes
        risk_before ────┤
        risk_after ─────┘

        therapist_id ──┐
        sessions ──────├──→ Therapist Performance
        rating ────────┘

        client_id ─┐
        status ────├──→ Client Statistics
        session ───┘
```

---

## Risk Score Calculation Flow

```
                    Client Record
                         │
              ┌──────────┬┴┬──────────┐
              │          │ │          │
              ▼          ▼ ▼          ▼
         completed_   total_    is_active
         sessions    sessions
              │          │          │
              │          └──────────┤
              │                     │
              ▼                     │
        Calculate Adherence        │
        ─────────────────         │
        adherence = completed /    │
                    total          │
        range: 0 - 1              │
        (0% - 100%)               │
              │                    │
              ▼                    │
        Adherence Level Check      │
        ──────────────────        │
        if (adherence < 0.50)     │
          baseScore = 3.5         │
        else if (adherence < 0.70)│
          baseScore = 4.5         │
        else                      │
          baseScore = 4.8         │
              │                    │
              ▼                    │
        Add Variance              │
        ───────────               │
        variance = random(0-1)   │
        risk_score = baseScore + variance
                                  │
              ┌───────────────────┘
              │
              ▼
        Risk Level Classification
        ─────────────────────────
        risk_score < 2.0    → ✅ Low Risk
        2.0 to 3.5          → ⚠️  Medium Risk
        > 3.5               → 🚨 High Risk
              │
              ▼
        Clamp to Range [1, 5]
              │
              ▼
        Store in clients.risk_score
              │
              ▼
        Used in:
        • Risk Assessment Endpoint
        • Client Filtering
        • At-Risk Alerts
        • Dashboard Charts
```

---

## Frontend to Backend Data Binding

```
Frontend Component
        │
        ├─ AnalyticsScreen
        │   └─ useAnalytics() Hook
        │       └─ useEffect(() => {
        │           fetch('/api/v1/analytics/dashboard')
        │             .then(r => r.json())
        │             .then(data => setAnalytics(data))
        │         }, [])
        │
        ▼
Backend Analytics Endpoint
        │
        ├─ GET /api/v1/analytics/dashboard
        │   ├─ Authenticate request
        │   ├─ Call analyticsController.getDashboardAnalytics()
        │   └─ Return combined metrics
        │
        ▼
Analytics Service
        │
        ├─ getClientStatistics()
        │   └─ Query: SELECT COUNT, GROUP BY diagnosis, risk_level
        │
        ├─ getSessionStatistics()
        │   └─ Query: SELECT COUNT, from sessions GROUP BY status
        │
        ├─ getTherapyOutcomes()
        │   └─ Query: SELECT AVG(rating), GROUP BY progress_category
        │
        ├─ getTherapistPerformance()
        │   └─ Query: SELECT AVG(rating), current_clients, max_clients...
        │
        ├─ getMonthlyGrowth()
        │   └─ Query: Loop 6 months, COUNT new_clients, sessions
        │
        └─ getRiskAssessment()
            └─ Query: SELECT * FROM clients WHERE risk_score > 3.5
        │
        ▼
SQLite Database
        │
        ├─ Execute queries
        ├─ Aggregate results
        └─ Return raw data
        │
        ▼
Backend Service Processing
        │
        ├─ Group & aggregate
        ├─ Calculate metrics
        ├─ Apply formulas
        └─ Format for API
        │
        ▼
JSON Response
        │
        {
          clientStats: {...},
          sessionStats: {...},
          therapyOutcomes: {...},
          therapistPerformance: {...},
          monthlyGrowth: {...},
          riskAssessment: {...}
        }
        │
        ▼
Frontend Updates State
        │
        setAnalytics(data)
        │
        ▼
Component Re-renders
        │
        ├─ Charts: PieChart(data.riskDistribution)
        ├─ Tables: Therapist rankings
        ├─ Cards: KPI metrics
        ├─ Alerts: At-risk warnings
        └─ Tabs: Analytics dashboard
        │
        ▼
User Sees Dashboard
        │
        ✓ Risk pie chart
        ✓ Session completion rate
        ✓ Top therapists
        ✓ Monthly growth chart
        ✓ At-risk client list
        └─ All powered by real database data!
```

---

## Error Handling Flow

```
    Endpoint Called
            │
            ▼
    ┌───────────────────┐
    │ Try-Catch Block   │
    │ wraps all logic   │
    └───┬───────────────┘
        │
        ├─ ✓ Success
        │   └─► JSON 200 OK
        │       { success: true, data: {...} }
        │
        ├─ ✗ Database Error
        │   └─► JSON 400
        │       { success: false, error: "msg" }
        │       Example: "Cannot find client"
        │
        ├─ ✗ Calculation Error
        │   └─► JSON 500
        │       { success: false, error: "msg" }
        │       Example: "Division by zero"
        │
        └─ ✗ Authentication Error
            └─► JSON 401
                (Caught by middleware)
```

---

## Metrics Hierarchy

```
                APPLICATION METRICS
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    CLIENT LEVEL   SESSION LEVEL   THERAPIST LEVEL
        │               │               │
        │               │               │
    ┌───┴────┐       ┌───┴───┐      ┌──┴──┐
    │         │       │       │      │     │
    ▼         ▼       ▼       ▼      ▼     ▼
  Active   Risk      Status  Rating  Rate  Capacity
  Count    Score     Count   Avg     Avg   Util%
    │         │       │       │      │     │
    │         │       │       │      │     │
    ├─────────┼───────┼───────┼──────┼─────┤
    │         │       │       │      │     │
    └────┬────┴───────┼───────┼──────┼─────┘
         │            │       │      │
         │            └───┬───┴──────┤
         │                │         │
         ▼                ▼         ▼
    AGGREGATED      TREND        PERFORMANCE
    DASHBOARD       TRACKING     RANKINGS
         │                │         │
         └────────┬───────┴────┬────┘
                  │            │
                  └────┬───────┘
                       │
                       ▼
                FRONTEND CHARTS
                      │
                      ├─ Pie Charts (Risk Distribution)
                      ├─ Line Charts (6-Month Trend)
                      ├─ Bar Charts (Session Status)
                      ├─ Tables (Top Therapists)
                      └─ Cards (KPI Metrics)
```

---

This visual reference shows how all components connect and data flows through the system! 📊
