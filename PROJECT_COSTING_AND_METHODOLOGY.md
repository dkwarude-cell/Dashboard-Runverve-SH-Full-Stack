# SmartHeal Dashboard: Methodology, Architecture, and Cost Estimation (COCOMO)

**Document Classification:** Internal / Financial Planning & Architecture  
**Project Name:** Dashboard-Runverve-SH-Full-Stack (SmartHeal)  
**Date prepared:** April 9, 2026  
**Budget Constraint:** < ₹40,000 INR  

---

## 1. Executive Summary

This document outlines the software development methodology, high-level system architecture, and formal cost estimation for the SmartHeal Dashboard project. Utilizing the Constructive Cost Model (COCOMO), the project's financial planning has been structurally optimized to remain strictly under the mandated ₹40,000 INR budget cap, leveraging an iterative approach and efficient architectural decoupling.

---

## 2. Software Development Methodology

The project adheres to the **Agile Software Development Methodology**, specifically utilizing a streamlined Scrum framework. This approach ensures high adaptability, rapid prototyping, and controlled expenditure.

**Key Agile Practices Implemented:**
*   **Iterative Sprints:** Development is divided into 2-week sprints, focusing on high-priority modules first (e.g., Core Patient CRUD, Analytics Engine).
*   **Continuous Integration (CI):** Decoupled repositories allow independent testing and merging of backend analytics and frontend UI components.
*   **Feedback Loops:** Incremental deliverables are reviewed repeatedly against clinic management requirements to minimize rework and keep development hours under budget.
*   **Lean Resource Management:** By utilizing pre-built abstractions (Supabase for auth/real-time DB, React Native for cross-platform), the development effort (and subsequently, cost) is drastically reduced.

---

## 3. System Architecture

The SmartHeal platform employs a **Decoupled Full-Stack Architecture**, built for high performance and cost-efficiency.

*   **Frontend (Presentation Layer):**
    *   Built with **React Native & Expo**, allowing a single codebase to serve Web, iOS, and Android platforms. This directly halves the development effort compared to native siloed development.
    *   Uses **NativeWind** for rapid UI styling.
*   **Backend (Business & API Layer):**
    *   A **Node.js/Express.js** REST API serves as the computational core.
    *   The **Analytics Engine** processes raw records locally via **SQLite3** to minimize expensive cloud compute costs during the initial rollout.
*   **Data & Auth Layer (Cloud):**
    *   **Supabase (PostgreSQL)** is utilized for core user authentication and real-time database subscriptions (`postgres_changes`), effectively replacing the need for an expensive dedicated backend engineering team.

---

## 4. COCOMO Cost Estimation Model

To ascertain the timeline and human resource effort, we utilize the **Basic COCOMO (Constructive Cost Model)**. 

### 4.1 Project Classification
The SmartHeal Dashboard is classified as an **Organic Project**. 
*   **Characteristics:** Small, highly experienced team; relaxed requirements; familiar in-house development environment (React/Node ecosystem).
*   **Estimated Size (KLOC):** Through the use of libraries and frameworks (Supabase, Expo), the custom business logic is optimized to approximately **1.5 KLOC** (Thousand Lines of Code).

**COCOMO Formuale for Organic Projects:**
*   **Effort ($E$):** $E = 2.4 \times (KLOC)^{1.05}$ (measured in Person-Months)
*   **Development Time ($D$):** $D = 2.5 \times (E)^{0.38}$ (measured in Months)

### 4.2 Effort and Schedule Calculation

1.  **Calculate Effort ($E$):**
    *   $E = 2.4 \times (1.5)^{1.05}$
    *   $E = 2.4 \times 1.53$
    *   **$E = 3.67$ Person-Months**

2.  **Calculate Development Time ($D$):**
    *   $D = 2.5 \times (3.67)^{0.38}$
    *   $D = 2.5 \times 1.64$
    *   **$D \approx 4.1$ Months**

3.  **Average Staffing Required:**
    *   $Staff = E / D = 3.67 / 4.1 \approx \textbf{0.9 Developers}$ (Effectively 1 developer working near full-time).

### 4.3 Financial Cost Allocation (Target: < ₹40,000)

To keep the project under the ₹40,000 threshold, the development relies on an optimized freelance/intern engineering rate or an offshore subsidized model. 

*   **Assumed Average Developer Cost:** ₹10,000 INR per Person-Month
*   **Calculated Effort:** 3.67 Person-Months

**Total Labor Cost Calculation:**
*   $Cost = Effort \times Average\_Salary$
*   $Cost = 3.67 \times \text{₹10,000}$
*   **Total Base Labor Cost:** $\text{₹36,700 INR}$

**Budget Breakdown:**
| Item | Description | Cost (INR) |
| :--- | :--- | :--- |
| **Development Labor** | 3.67 Person-Months @ ₹10,000/PM | ₹36,700 |
| **Infrastructure (Cloud)** | Vercel/Supabase Free Tiers + Local SQLite | ₹0 |
| **Contingency Margin** | 8.9% buffer for unexpected overhead | ₹3,260 |
| **Total Project Estimate** | | **₹39,960** |

### 4.4 Conclusion of Costing
By classifying the project as an **Organic** build, maintaining a tight footprint of **~1.5 KLOC** through heavy reliance on standard libraries, and executing via an Agile methodology, the SmartHeal Dashboard can be successfully architected and delivered for **₹39,960 INR**, comfortably satisfying the sub-₹40,000 constraint.

*Prepared and Approved by: Project Management Office (PMO)*