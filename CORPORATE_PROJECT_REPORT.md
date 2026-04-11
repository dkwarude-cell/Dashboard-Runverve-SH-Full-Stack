# SmartHeal Dashboard: Comprehensive Project Status & Technical Report

**Document Classification:** Internal / Confidential  
**Project Name:** Dashboard-Runverve-SH-Full-Stack (SmartHeal)  
**Date prepared:** April 9, 2026  

---

## 1. Executive Summary

This document serves as the formal project report for the **SmartHeal Dashboard**, a full-stack, cross-platform health-tech management application. Designed as a comprehensive control center for healthcare administrators and therapy providers, the platform consolidates patient (client) management, session tracking, real-time analytics, medical device monitoring, and secure communications into a singular, cohesive interface.

The project has successfully reached a mature implementation phase, delivering both a robust frontend application built on modern mobile/web frameworks and a tailored backend service architecture. Key strategic milestones, particularly the completion of the advanced Analytics Engine and its underlying data seeding mechanisms, have been achieved, ensuring the platform is structurally sound and ready for clinical operational trials or further enterprise scaling.

---

## 2. Project Overview and Objectives

The primary objective of the SmartHeal Dashboard is to digitize and optimize the workflow of therapy clinics and healthcare facilities. 

**Core Business Objectives:**
*   **Operational Efficiency:** Reduce administrative overhead by centralizing scheduling, client records, and support queries.
*   **Data-Driven Decisions:** Implement a comprehensive analytics suite to track therapy outcomes, provider (therapist) performance, and business growth trends.
*   **Proactive Care Management:** Utilize automated algorithms to identify "At-Risk" clients based on session adherence and treatment progress, enabling timely clinical interventions.
*   **Integrated Device Management:** Provide real-time status monitoring for integrated medical/therapy equipment.

---

## 3. System Architecture & Technical Stack

The platform utilizes a decoupled, modern full-stack architecture ensuring high cohesion and low coupling between the presentation layer and the data processing backend.

### 3.1 Frontend Architecture
The frontend is engineered as a universal application capable of running on Web, iOS, and Android platforms from a single codebase.
*   **Framework:** React Native with Expo.
*   **Styling:** NativeWind (Tailwind CSS for React Native) ensures a consistent, responsive, and highly maintainable corporate UI/UX.
*   **State Management & Data Fetching:** Custom React Hooks (`useClients`, `useSessions`, `useAnalytics`, etc.) layered over Supabase client libraries for real-time data synchronization.
*   **Routing:** Expo Router (file-based routing via the `app/` directory).

### 3.2 Backend Architecture & Database
The backend serves as the secure data processing, aggregation, and API routing layer.
*   **Runtime & Framework:** Node.js with Express.js.
*   **Database Integration:** 
    *   **Primary Real-time DB / Auth:** Supabase (PostgreSQL) handles real-time subscriptions, user provisioning, and row-level security.
    *   **Local/Analytics Processing DB:** SQLite (`smartheal.db`), managed via Knex.js migrations, used for local data ingestion, rapid querying, and advanced analytics calculations.
*   **Architecture Pattern:** Controller-Service-Route pattern ensures clean separation of business logic (Services) from HTTP request handling (Controllers).

---

## 4. Key Deliverables & Implemented Features

The development lifecycle has successfully delivered the following critical modules:

### 4.1 Advanced Analytics Engine (Completed Module)
A cornerstone of the platform, the Analytics Engine processes complex datasets to provide actionable business and clinical intelligence.
*   **Key Deliverables:** 
    *   Implementation of 8 dedicated REST API endpoints (`/api/v1/analytics/...`).
    *   **Risk Assessment Algorithm:** Automatically calculates patient risk scores (1-5) based on attendance and behavioral metrics.
    *   **Therapist Performance Metrics:** Aggregates patient ratings, workload capacity, and session completion rates to rank provider effectiveness.
    *   **Dummy Data Seeding:** A comprehensive mock data pipeline generating users, sessions, and analytical records for staging and testing environments.

### 4.2 Client & Administrative Management
*   **Client Records System:** Full CRUD capabilities with advanced filtering and search methodologies. Real-time Postgres subscriptions ensure all staff view the most up-to-date patient status.
*   **Session Scheduling:** Tracks session states (Completed, Scheduled, Cancelled, In Progress) and calculates institutional attendance rates.

### 4.3 Technical & Support Infrastructure
*   **Device Controls Module:** Real-time telemetry monitoring for connected medical hardware, tracking statuses such as "Connected," "Standby," and "Offline."
*   **Query Management (Ticketing):** Internal support ticketing system for resolving clinical or administrative blockers.

### 4.4 Communication & AI Integration
*   **Communication Hub:** Integrated messaging system mapping therapists to their respective clients.
*   **AI Assistant:** Embedded contextual AI chat interface capable of referencing internal documentation and assisting staff with administrative tasks, utilizing modern AI abstraction layers.

---

## 5. Data Architecture & Flow

The system employs a unidirectional data flow pattern reinforced by real-time websockets.

1.  **Ingestion:** Data is entered via the React Native frontend or generated via automated device telemetry.
2.  **Storage:** Writes are executed securely against the backend API or directly to Supabase depending on security rules.
3.  **Real-Time Synchronization:** Supabase `postgres_changes` webhooks blast updates to connected client instances. Hooks such as `useClients()` automatically merge these changes into local React state.
4.  **Analytics Aggregation:** Periodically, or on-demand, the Node.js backend processes raw transaction data (from `clients`, `sessions`, `profiles`) through the `analyticsService.js`, reducing millions of rows into aggregated KPIs (e.g., Monthly Growth, Session Trends).

---

## 6. Security, Authentication, and Authorization

Security is integrated at the foundational level, critical for health-tech compliance.
*   **Authentication Flow:** Managed via Supabase Auth. The `AuthProvider` component wraps the core application, ensuring unauthorized traffic is redirected to the securely isolated `/(auth)` route group.
*   **Role-Based Access Control (RBAC):** Profiles are strictly typed (e.g., `therapist`, `admin`, `support`). Data visibility is truncated based on these roles (e.g., a therapist may only view records uniquely assigned to their `therapist_id`).

---

## 7. Deployment & Operational Guidelines

The repository is structured for rapid CI/CD deployment.

**Backend Initialization:**
1.  Navigate to `/backend`.
2.  Execute `npm run seed:data` to initialize tables and populate baseline metrics.
3.  Execute `npm run dev` to instantiate the Express.js server on port 3000.

**Frontend Initialization:**
1.  Navigate to the repository root.
2.  Execute `npm install` followed by `npm run dev` to launch the Expo Metro bundler.
3.  Deploy targeting standard web (Vercel/Netlify via `vercel.json`) or compile for native iOS/Android targets using Expo EAS build pipelines.

---

## 8. Conclusion and Future Scalability

The SmartHeal Dashboard represents a paradigm shift in clinic administration. By decoupling the analytical heavy lifting (Node.js/Knex) from real-time operational data (Supabase), the architecture achieves horizontal scalability. 

**Next Phase Recommendations:**
1.  **Production Database Migration:** Transition the internal SQLite analytics processing engine to a managed analytical database (e.g., PostgreSQL or Snowflake) as data volume exceeds local constraints.
2.  **Compliance Auditing:** Prior to formal launch, execution of a complete HIPAA/GDPR compliance audit on the primary data schemas, specifically concerning `avatar_color`, `notes`, and PHI masking.
3.  **Hardware Integration Expansion:** Broaden the `useDevices()` hardware API to support industry-standard IoT healthcare protocols.

*Prepared by: Engineering & Architecture Division*