# SmartHeal Analytics Setup Checklist

## Phase 1: Database Setup ⚙️

### Part A: Schema Creation

- [ ] Open Supabase Dashboard
- [ ] Navigate to SQL Editor
- [ ] Click "New Query"
- [ ] Open file: `supabase/schema.sql`
- [ ] Copy entire content
- [ ] Paste into Supabase SQL Editor
- [ ] Click "Run"
- [ ] Wait for success confirmation
- [ ] Check SQL errors (should be none)

**Expected Result:**

```
✅ All tables created:
  - profiles
  - clients
  - sessions
  - queries
  - query_responses
  - devices
  - messages
  - analytics_events
```

### Part B: Seed Data Insertion

- [ ] Click "New Query" in SQL Editor
- [ ] Open file: `supabase/seed.sql`
- [ ] Copy entire content
- [ ] Paste into new Supabase query
- [ ] Click "Run"
- [ ] Wait for success confirmation
- [ ] Check for errors (should be none)

**Expected Result:**

```
✅ All data inserted:
  - 4 therapist profiles
  - 12 clients
  - 25 sessions with therapist assignments
  - 6 devices
  - 6 support queries
  - 6 query responses
  - 20 analytics events
```

### Part C: Data Verification

- [ ] Go to Supabase Table Editor
- [ ] Check **profiles** table
  - [ ] Should have 4 rows
  - [ ] Includes Dr. Neha Patel, Dr. Sharma, Dr. Singh, Support
- [ ] Check **clients** table
  - [ ] Should have 12 rows
  - [ ] Check column headers: id, name, email, progress, adherence, status, therapist_id
  - [ ] Verify therapist_id references valid profiles
- [ ] Check **sessions** table
  - [ ] Should have 25 rows
  - [ ] Check therapist_id matches profile UUIDs
  - [ ] Verify status values (Completed, Scheduled, Cancelled)
- [ ] Check **devices** table
  - [ ] Should have 6 rows
  - [ ] Check status values (Connected, Standby, Offline)
- [ ] Check **queries** table
  - [ ] Should have 6 rows
  - [ ] Check priority values (Critical, High, Medium, Low)
- [ ] Check **analytics_events** table
  - [ ] Should have 20+ rows
  - [ ] Check event_type values (login, signup)

---

## Phase 2: Application Setup 🚀

### Part A: Environment Variables

- [ ] Create `.env` file in project root (same folder as `package.json`)
- [ ] Add Supabase URL:
  ```
  EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  ```
- [ ] Add Supabase Anon Key:
  ```
  EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
  ```
- [ ] Add OpenRouter API Key:
  ```
  EXPO_PUBLIC_OPENROUTER_API_KEY=sk-or-...
  ```
- [ ] Verify `.env` file is NOT in Git (check `.gitignore`)

### Part B: Code Installation

- [ ] Verify `lib/analytics.ts` exists
  - [ ] Should have functions: calculateClientStats, calculateSessionStats, etc.
- [ ] Verify `hooks/useAnalytics.ts` is updated
  - [ ] Should import from `@/lib/analytics`
  - [ ] Should return clientStats, sessionStats, therapistPerformance, riskClients
- [ ] Verify new documentation files exist:
  - [ ] `ANALYTICS_SETUP.md`
  - [ ] `DUMMY_DATA_SETUP.ts`
  - [ ] `IMPLEMENTATION_EXAMPLES.ts`
  - [ ] `lib/sample-analytics-data.ts`
  - [ ] `ANALYTICS_COMPLETE_SUMMARY.md`

### Part C: Application Restart

- [ ] Stop dev server (Ctrl+C if running)
- [ ] Clear cache (optional): `npm cache clean` or `expo clear`
- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm start`
- [ ] Wait for compilation to complete
- [ ] Check console for errors

**Expected Output:**

```
✅ Expo dev server running
✅ Web bundle compiled successfully
✅ No errors in console
```

---

## Phase 3: Application Testing 🧪

### Part A: Load Dashboard Screen

- [ ] Open app in browser (http://localhost:8081 or via QR code)
- [ ] Navigate to Dashboard screen
- [ ] Check stat cards load
  - [ ] Total Clients: 12
  - [ ] Active Sessions: 4 (or similar)
  - [ ] Completion Rate: 72%
  - [ ] Total Devices: 6
- [ ] Verify recent clients display
- [ ] Verify today's schedule shows (or empty if no current sessions)

### Part B: Load Analytics Screen

- [ ] Navigate to Analytics screen
- [ ] Wait for data to load
- [ ] Verify all charts display:
  - [ ] Client Distribution pie chart
  - [ ] Session Trends bar chart
  - [ ] Therapy Outcomes bar chart
  - [ ] Growth Data chart
- [ ] Check no errors in console

### Part C: Check Browser Console

- [ ] Press F12 to open Dev Tools
- [ ] Go to Console tab
- [ ] Look for errors (should be near-zero)
- [ ] Verify no "Supabase connection" errors
- [ ] Verify no "undefined" references to therapists

### Part D: View Sample Data (Optional)

- [ ] Open browser console (F12)
- [ ] Run test code:
  ```javascript
  // View sample data values
  import { SAMPLE_CLIENT_STATS } from "./lib/sample-analytics-data.ts";
  console.log(SAMPLE_CLIENT_STATS);
  ```

---

## Phase 4: Validation & Testing 📊

### Check Analytics Calculations

- [ ] Did useAnalytics hook populate with data?
- [ ] Are client statistics showing correct values?
- [ ] Is therapist performance ranked?
- [ ] Are at-risk clients identified?

**Validate Key Metrics:**

- [ ] Total Clients = 12 ✓
- [ ] Active Clients = 9 ✓
- [ ] Session Completion Rate = 72% ✓
- [ ] Average Client Progress = 65% ✓
- [ ] At-Risk Clients = 3 ✓

### Test Real-Time Functionality

- [ ] Make a change in Supabase (e.g., update client progress)
- [ ] Watch for real-time update in app
- [ ] Click refresh button on analytics
- [ ] Verify data refreshes correctly

### Test Error Handling

- [ ] Disconnect internet (turn on offline mode)
- [ ] Verify app shows loading state
- [ ] Reconnect internet
- [ ] Verify data reloads

---

## Phase 5: Documentation Review 📚

### Read Setup Guides

- [ ] Read `ANALYTICS_SETUP.md` completely
  - [ ] Understand database structure
  - [ ] Review dummy data overview
  - [ ] Check troubleshooting section
- [ ] Skim `IMPLEMENTATION_EXAMPLES.ts`
  - [ ] Review example component patterns
  - [ ] Note how to use useAnalytics() hook
- [ ] Review `lib/sample-analytics-data.ts`
  - [ ] Note all expected data values
  - [ ] See example usage patterns

### Understand Analytics Library

- [ ] Open `lib/analytics.ts`
- [ ] Read through calculateClientStats function
- [ ] Read through calculateTherapistPerformance function
- [ ] Read through identifyRiskClients function
- [ ] Understand TypeScript interfaces

---

## Phase 6: Enhancement Ideas 🎨

### Potential Improvements

- [ ] Add at-risk client badge to client list
- [ ] Add therapist performance widget to dashboard
- [ ] Add monthly growth chart
- [ ] Add therapy outcomes comparison
- [ ] Create alerts for high-risk clients
- [ ] Add drill-down functionality to charts
- [ ] Implement client health score

### Track Enhancement Backlog

- [ ] Enhancement 1: ********\_********
- [ ] Enhancement 2: ********\_********
- [ ] Enhancement 3: ********\_********
- [ ] Enhancement 4: ********\_********

---

## Phase 7: Production Readiness ✅

### Before Going Live

- [ ] All data verified in Supabase ✓
- [ ] Analytics showing correct values ✓
- [ ] No console errors ✓
- [ ] Real-time subscriptions working ✓
- [ ] Error handling tested ✓
- [ ] Performance acceptable ✓

### Security Checklist

- [ ] `.env` file not committed to Git
- [ ] Supabase RLS policies configured
- [ ] No sensitive data in logs
- [ ] API keys rotated periodically

### Documentation Checklist

- [ ] Setup guide complete ✓
- [ ] Code examples provided ✓
- [ ] Sample data documented ✓
- [ ] Analytics calculated correctly ✓

---

## Troubleshooting Checklist 🔧

If something isn't working:

### Issue: No data showing

- [ ] Verify schema.sql ran without errors
- [ ] Verify seed.sql ran without errors
- [ ] Check Supabase Table Editor for data
- [ ] Restart dev server
- [ ] Clear browser cache
- [ ] Check Supabase credentials in .env

### Issue: Therapist names undefined

- [ ] Verify profiles table has therapist records
- [ ] Check therapist_id values in sessions
- [ ] Re-run seed.sql if needed
- [ ] Restart dev server

### Issue: Charts not displaying

- [ ] Check browser console for errors
- [ ] Verify chartData prop format
- [ ] Ensure sample-analytics-data loaded
- [ ] Test with dummy data first

### Issue: Slow performance

- [ ] Check network request times
- [ ] Reduce query scope if possible
- [ ] Check database indexes
- [ ] Consider adding caching

---

## Files Created/Modified Summary

### Created Files ✨

- [x] `lib/analytics.ts` - Analytics calculation library
- [x] `lib/sample-analytics-data.ts` - Sample data reference
- [x] `ANALYTICS_SETUP.md` - Setup guide
- [x] `DUMMY_DATA_SETUP.ts` - Documentation
- [x] `IMPLEMENTATION_EXAMPLES.ts` - Component examples
- [x] `ANALYTICS_COMPLETE_SUMMARY.md` - Complete summary

### Modified Files ✏️

- [x] `supabase/schema.sql` - No changes needed (already complete)
- [x] `supabase/seed.sql` - Enhanced with therapist profiles and fixed references
- [x] `hooks/useAnalytics.ts` - Enhanced to use analytics library

### Unchanged Files (No changes needed) 📋

- [ ] `DashboardScreen.tsx` - Works with updated hook
- [ ] `AnalyticsScreen.tsx` - Works with updated hook
- [ ] `useClients.ts` - No changes needed
- [ ] `useSessions.ts` - No changes needed
- [ ] All other files

---

## Final Verification Checklist ✅

When everything is complete, verify:

- [ ] Database schema created in Supabase
- [ ] Dummy data seeded in Supabase
- [ ] All 12 client records present
- [ ] All 25 session records present
- [ ] All 4 therapist profiles present
- [ ] All 6 devices present
- [ ] `.env` file configured with credentials
- [ ] Dev server running without errors
- [ ] Dashboard screen loads with correct metrics
- [ ] Analytics screen loads with charts
- [ ] useAnalytics() hook returns proper data
- [ ] No errors in browser console
- [ ] Real-time updates working
- [ ] Documentation files present
- [ ] All examples reviewed

---

## Success Criteria ✨

You'll know everything is working when:

✅ Dashboard shows "Total Clients: 12"
✅ Analytics screen displays all 4 charts
✅ useAnalytics hook has no undefined values
✅ At-risk clients are identified (3 found)
✅ Therapist performance is ranked
✅ No errors in console
✅ Charts render correctly
✅ Data updates in real-time

---

## Next Phase: Enhancement

Once basic setup is complete and verified, consider:

1. **Add Advanced Filters**
   - [ ] Filter by therapist
   - [ ] Filter by client type
   - [ ] Filter by date range

2. **Create Custom Reports**
   - [ ] Monthly therapy outcomes
   - [ ] Therapist performance reports
   - [ ] Client progress reports

3. **Build Alerts & Notifications**
   - [ ] At-risk client alerts
   - [ ] Low completion rate alerts
   - [ ] Device offline alerts

4. **Implement Analytics Export**
   - [ ] Export to PDF
   - [ ] Export to Excel
   - [ ] Email reports

---

## Questions or Issues?

Refer to:

1. `ANALYTICS_SETUP.md` - Setup guide with detailed steps
2. `IMPLEMENTATION_EXAMPLES.ts` - How to use in components
3. `lib/analytics.ts` - Implementation details
4. Browser console - For runtime errors
5. Supabase Table Editor - To verify data

---

**Estimated Time to Complete:** 30-45 minutes
**Difficulty Level:** Intermediate
**Prerequisites:** Supabase account, npm installed, basic React knowledge

Good luck! 🚀
