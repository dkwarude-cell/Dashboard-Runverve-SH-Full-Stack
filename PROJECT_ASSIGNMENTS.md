# Project Assignments

---

# Assignment 1: Environment Setup and Requirement Gathering

**Title**
Environment Setup and Requirement Gathering for SmartHeal – Healthcare Dashboard Application

**Aim / Objective**
To install and configure development tools, select appropriate frontend, backend, and database technologies, and gather requirements for building a full-stack healthcare dashboard web and mobile application for SmartHeal using React Native (Expo), Node.js, and PostgreSQL.

**Problem Statement**
The SmartHeal medical dashboard aims to present dynamic therapy analytics, client and session management, and medical device monitoring with a modern, responsive UI. Before development, it is necessary to set up the local environment—including containerized databases via Docker—and understand requirements such as healthcare data visualization, AI assistant integration, and user interaction features for doctors and therapists.

**Theory / Concept**
Full Stack Development involves working on both:

- **Frontend (Client-side):** User interface, cross-platform views, and user experience (UX).
- **Backend (Server-side):** Business logic, REST APIs, database queries, and system integrations.

**Tools Used**

- **VS Code:** Code editor
- **Git:** Version control system
- **Postman:** API testing tool
- **Node.js:** Runtime environment
- **Docker:** Containerization platform (for PostgreSQL)

**Technology Selection**

- **Frontend Options:**
  - Vanilla HTML, CSS, JavaScript
  - React.js (Web only)
  - React Native / Expo (Cross-platform Web & Mobile)
- **Backend Options:**
  - PHP
  - Django (Python)
  - Node.js with Express and Knex.js

**Tools & Technologies Used**

- Visual Studio Code
- Git & GitHub
- Postman
- Node.js
- React Native / Expo (Chosen for universal UI)
- Express.js (Chosen for Backend API)
- PostgreSQL via Docker (Chosen for Database)

**Steps / Procedure**

**Step 1: Install Development Tools**

- Installed VS Code
- Installed Git and configured it
- Installed Node.js
- Installed Postman
- Installed Docker Desktop

**Step 2: Setup Project Environment**

- Created project folder: `Dashboard-Runverve-SH-Full-Stack`
- Created React Native app using: `npx create-expo-app`
- Set up backend `express` server and `docker-compose.yml` for database.
- Verified installation using:
  - `node -v`
  - `npm -v`
  - `docker --version`

**Step 3: Select Frontend Technology**

- Selected **React Native (Expo)** for component-based structure and cross-platform capabilities (runs on iOS, Android, and Web) using component libraries and Tailwind styling.

**Step 4: Select Backend Technology**

- Selected **Node.js with Express** mapped to a **PostgreSQL** database (via Knex.js) for handling concurrent, data-heavy requests.

**Step 5: Identify Client / Organization**

- **Client:** SmartHeal
- **Domain:** Healthcare Technology / MedTech

**Step 6: Requirement Gathering**
Collected requirements using:

- Discussion with stakeholders/client
- Understanding healthcare provider needs

**Functional Requirements:**

- Display dynamic analytics dashboard fetching live backend data.
- Manage clients and view detailed therapy session histories securely via Modals.
- Device controls monitoring for medical equipment (Ultrasound, EMS, TENS).
- Query management system (Support tickets) with interactive status resolving mapping.
- Integrated AI Assistant utilizing LLM endpoints to suggest clinical therapy protocols.

**Non-Functional Requirements:**

- Smooth cross-platform mobile/web responsiveness
- Fast rendering and data fetching
- Secure handling of mock medical data
- Polished, professional, and accessible UI layout

**Expected Output / Result**

- Development environment successfully set up (Node + Expo + Docker)
- Required tools installed and configured
- Technologies selected for development
- Client requirements documented clearly

**Conclusion**
This practical helped in understanding the importance of environment setup and requirement gathering before starting the medical dashboard project. It ensures proper planning, modern technology stack selection, and a smooth development timeline.

---

## Comparison Tables

**Frontend Comparison:**

| Technology          | Advantages                       | Limitations                                   |
| :------------------ | :------------------------------- | :-------------------------------------------- |
| HTML/CSS/JS         | Simple                           | Not highly scalable for complex apps          |
| React.js            | Component-based, fast UI         | Web only, needs separate mobile app setup     |
| React Native (Expo) | Cross-platform (Web/iOS/Android) | Slightly higher learning curve, heavier build |

**Backend Comparison:**

| Technology        | Advantages                           | Limitations                            |
| :---------------- | :----------------------------------- | :------------------------------------- |
| PHP               | Simple to host                       | Sometimes considered outdated for APIs |
| Django (Python)   | Highly secure, batteries-included    | Heavy framework                        |
| Node.js (Express) | Fast, highly scalable, JS everywhere | Asynchronous complexity                |

**Database Comparison:**

| Technology | Advantages                           | Limitations                                                   |
| :--------- | :----------------------------------- | :------------------------------------------------------------ |
| MySQL      | Structured, widely adopted           | Less flexible schema handling                                 |
| MongoDB    | Highly flexible (NoSQL)              | No strict querying structure, data integrity handled app-side |
| PostgreSQL | Advanced data types, highly reliable | Requires a bit more initial configuration                     |

---

# Assignment 2: Build Basic Frontend Page

**Title**
Design and Development of Basic Frontend Layout and Dashboard for SmartHeal

**Aim / Objective**
To design and develop a responsive frontend layout for the SmartHeal medical dashboard using React Native (Expo) with Tailwind CSS, and to understand basic UI/UX and cross-platform responsive design principles.

**Problem Statement**
A professional healthcare setup like SmartHeal requires a modern, clean, and user-friendly interface to manage complex patient data, device controls, and analytics securely. The goal is to create universal layout components (Sidebar, Header, Main Dashboard) that introduce the platform's capabilities and adapt smoothly across web, tablet, and mobile devices.

**Theory / Concept**
Frontend development focuses on designing the user interface and user experience of an application.

Key concepts:

- **Component-Based Architecture:** Breaking down the UI into reusable pieces (e.g., `StatCard`, `Sidebar`, `Button`).
- **Responsive Design:** Adjusting layout and font sizes for mobile, tablet, and desktop views.
- **UI Design:** Creating visually appealing interfaces using modern styling utility classes.

Technologies used:

- React Native (Expo) for component-based universal UI
- Tailwind CSS (via NativeWind) for utility-first styling
- TypeScript for type safety and structured code

**Tools & Technologies Used**

- Visual Studio Code
- Node.js
- React Native / Expo
- Tailwind CSS (NativeWind)
- Web Browser (Chrome/Edge) or Mobile Simulator

**Steps / Procedure**

**Step 1: Organize Frontend Folder Structure**

- Opened the `Dashboard-Runverve-SH-Full-Stack` folder in VS Code.
- Organized directories: `app/` (routing), `components/` (UI), `hooks/` (state), and `assets/`.

**Step 2: Create Necessary Layout Files**

- Created layout structural components:
  - `components/layout/Sidebar.tsx`
  - `components/layout/Header.tsx`
  - `app/(app)/_layout.tsx` (Main App wrapper)
  - `components/screens/DashboardScreen.tsx`

**Step 3: Design Basic Structure of Layout**

**Sidebar**

- SmartHeal Logo and branding.
- Navigation Menu with categories: Main (Dashboard, Clients, Sessions, Analytics), Communication (Queries), AI & Insights, Administration.

**Header**

- Page Title (dynamic based on route).
- Notification bell with unread badges.
- User Profile Avatar and Admin Name displaying "Dr. SmartHeal Admin".

**Dashboard Content Area**

- Welcome message and summary statistics.
- KPI Stat Cards (Total Clients, Active Sessions, Completion Rate, Connected Devices).

**Step 4: Apply Styling**

- Applied Tailwind classes for styling:
  - Colors (e.g., brand red `#d4183d`, slate grays for text).
  - Layout spacing using Flexbox (`flex-row`, `justify-between`, `items-center`).
  - Consistent padding and rounded corners.

**Step 5: Implement Basic Responsive Design**

- Created a custom `useResponsive.ts` hook.
- Adjusted layout for different screen sizes (e.g., hiding Sidebar behind a hamburger menu on mobile devices, wrapping flex columns on smaller widths).

**Step 6: Run and Test**

- Ran the local server using `npx expo start`.
- Opened the page in the browser and tested responsiveness by resizing the window window.

**Output / Result**

- A responsive dashboard layout is successfully created.
- The Sidebar and Header display correctly and navigate intuitively.
- The page layout dynamically adjusts for desktop and mobile screen sizes.

**Conclusion**
This practical assignment helped in understanding basic frontend component architecture, layout design, and responsive design techniques using modern tools like React Native and Tailwind CSS.

**Output Screenshots:**
_(Attach screenshots of the Web/Desktop Dashboard view and the collapsed Mobile view here)_

---

# Assignment 3: Interactive Frontend Form

**Title**
Design and Development of Interactive Support Query Form for SmartHeal

**Aim / Objective**
To design and implement an interactive form using React Native (Expo) and dynamically capture and display submitted user data (support tickets) within the application without reloading the page.

**Problem Statement**
SmartHeal requires a professional query management form to collect support requests from doctors and clinics regarding medical devices. The task is to create an interactive form that captures user input (such as issue details and priority) and updates the support list dynamically using React state.

**Theory / Concept**

Frontend forms are used to collect user data.

Key concepts:

- **Form elements:** Inputs, dropdowns, and buttons adapted for cross-platform (e.g., `TextInput`, `TouchableOpacity`).
- **Event handling:** Capturing text changes and submission events (e.g., `onChangeText`, `onPress`).
- **State management:** Using React Hooks to hold form data.
- **Dynamic data display:** Automatically re-rendering the UI when the state updates.

Technologies used:

- React Native (Expo) for component-based UI
- Tailwind CSS (NativeWind) for styling
- TypeScript for type-safe state shapes

**Tools & Technologies Used**

- VS Code
- React Native / Expo
- Tailwind CSS
- Web Browser (Chrome/Edge) or Mobile Simulator

**Steps / Procedure**

**Step 1: Create a new page or modal component for the form.**

- Navigated to `components/screens/QueryManagementScreen.tsx`.

**Step 2: Design the form structure with following inputs:**

- **User Name:** (Text Field)
- **Clinic / Hospital Name:** (Text Field)
- **Contact Email:** (Email Field)
- **Priority Level:** (Radio Group / Dropdown – High, Medium, Low)
- **Issue Category:** (Dropdown – Hardware, Software, Billing)
- **Associated Device:** (Checkboxes – Ultrasound, EMS, TENS)
- **Query Description:** (Multiline Text Area)

**Step 3: Add a submit button.**

- Created a "Submit Query" button using `TouchableOpacity`.

**Step 4: Apply basic styling using Tailwind CSS:**

- **Proper alignment:** Used `flex-col` and `gap-4` for vertical spacing.
- **Spacing:** Applied `p-4` (padding) and `mb-4` (margin bottom) around input containers.
- **Labels and input formatting:** Styled text inputs with `border`, `rounded-md`, and focus states.

**Step 5: Implement form interactivity:**

- **Capture input values on submit:**
- **Use React state:**
  ```javascript
  const [formData, setFormData] = useState({
    name: "",
    clinic: "",
    email: "",
    priority: "Medium",
    category: "",
    devices: [],
    description: "",
  });
  ```

**Step 6: Handle form submission state.**

- Triggered state update functions (`setFormData`) on text change to keep data synced, avoiding full page reloads seamlessly in React Native.

**Step 7: Display entered data dynamically on the same page:**

- Appended the new form object to the mock `DEMO_QUERIES` state array.
- Rendered the newly added query instantly in the "Active Queries" list view.

**Step 8: Test form functionality:**

- **Check all inputs:** Verified typing and dropdown selection worked correctly.
- **Validate display output:** Confirmed the new query appeared at the top of the list upon submission.

**Output / Result**

- Interactive support query form created successfully.
- User inputs captured correctly in React state.
- Data displayed dynamically in the Active Queries list on the same screen.

**Conclusion**
This practical helped in understanding form handling, event handling, and dynamic data rendering using React state and frontend technologies.

**Output Screenshots:**
_(Attach screenshots of the empty form, filled form, and the dynamically updated query list here)_

---

# Assignment 4: Backend API Development & Database Integration

**Title**
Design and Development of Backend APIs with Database Integration for SmartHeal

**Aim / Objective**
To develop RESTful APIs using Node.js and Express, connect with a PostgreSQL database (via Docker), and perform CRUD operations for handling SmartHeal's dashboard analytics and medical data.

**Problem Statement**
The SmartHeal frontend interface fetches and displays complex therapy data, but relying on static mock data is not scalable. The task is to build a robust backend API server that can store, retrieve, update, and manage this data securely using a relational database.

**Theory / Concept**
Backend development handles:

- Business logic
- API creation
- Database interaction

**Key Concepts:**

- **RESTful APIs:** Communication architecture between frontend and backend.
- **CRUD Operations:**
  - Create → Add new records
  - Read → View data (e.g., analytics dashboard)
  - Update → Modify existing records (e.g., mark query as solved)
  - Delete → Remove records
- **Knex.js:** SQL Query Builder for Node.js used to interact with the PostgreSQL database securely.
- **Database Integration:** Storing and retrieving relational data efficiently.

**Tools & Technologies Used**

- Node.js
- Express.js
- PostgreSQL (via Docker)
- Knex.js
- Postman
- VS Code

**Steps / Procedure**

**Step 1: Create a backend project folder.**

- Organized the `backend/` directory within the workspace.

**Step 2: Initialize Node.js project using `npm init`.**

**Step 3: Install required packages:**

- `express`
- `pg` (PostgreSQL client)
- `knex`
- `cors`

**Step 4: Create server configuration files (e.g., `src/server.js`, `src/app.js`).**

**Step 5: Setup Express server:**

- Initialize app
- Define port (e.g., 3000)
- Use middleware (CORS, JSON body parser)

**Step 6: Connect to PostgreSQL using Knex.js:**

- Configure `knexfile.js` to connect to the Dockerized PostgreSQL instance (port 5433).
- Establish and test the connection.

**Step 7: Create schema and structure using Migrations:**

- Created migration for the tables (e.g., analytics):
  ```javascript
  exports.up = function (knex) {
    return knex.schema.createTable("analytics", (table) => {
      table.increments("id").primary();
      table.string("metric_name");
      table.integer("value");
      table.timestamps(true, true);
    });
  };
  ```

**Step 8: Develop RESTful APIs (Controllers & Routes):**

- **GET → Retrieve data**
  ```javascript
  router.get("/dashboard", async (req, res) => {
    const data = await knex("analytics").select("*");
    res.json({ success: true, data });
  });
  ```
- **POST → Save data**
  ```javascript
  router.post("/metrics", async (req, res) => {
    const newMetric = await knex("analytics").insert(req.body).returning("*");
    res.json(newMetric);
  });
  ```

**Step 9: Test APIs using Postman:**

- Checked connection to `http://localhost:3000/api/v1/analytics/dashboard`.
- Verified JSON response structure for CRUD operations.

**Step 10: Handle errors and responses properly using Express middleware.**

**Output / Result**

- Backend Express server created successfully.
- PostgreSQL database connected using Knex.js.
- REST APIs implemented for data fetching.
- Analytics and dashboard data stored and retrieved successfully.

**Conclusion**
This practical helped in understanding backend development, RESTful API creation, and relational database integration using Node.js, Express, and PostgreSQL.

**Output Screenshots:**
_(Attach screenshots of the Postman API requests/responses and the running backend terminal here)_

---

# Assignment 5: Full Project Integration & Deployment (SmartHeal)

**Title**
Integration and Deployment of Full Stack Web & Mobile Dashboard for SmartHeal

**Aim / Objective**
To integrate the React Native (Expo) frontend with the Node.js backend APIs, test all functionalities, deploy the backend services, and build the frontend application to demonstrate a complete working system for SmartHeal.

**Problem Statement**
The SmartHeal project consists of a frontend (React Native UI with Tailwind CSS) and backend (Node.js APIs with PostgreSQL). The task is to connect both systems, ensure smooth data flow for analytics and queries, deploy the backend online (or configure for staging), and verify that the application works as per healthcare client requirements.

**Theory / Concept**
Full Stack Integration includes:

- Connecting frontend with backend APIs
- Handling dynamic data flow
- Deployment and build processes of the application

**Key concepts:**

- **API Integration:** Connecting UI components (e.g., Dashboard, Query Form) with backend services
- **Client-Server Communication**
- **Deployment & Build:** Hosting the backend APIs and building the Expo app for distribution
- **Testing:** Ensuring proper functionality across web and mobile views

**Tools & Technologies Used**

- Frontend: React Native (Expo)
- Backend: Node.js with Express
- Database: PostgreSQL
- Postman (API testing)
- Expo / EAS (Frontend build/deployment)
- Render or similar platform (Backend deployment)
- GitHub

**Steps / Procedure**

**Step 1: Integrate Frontend with Backend**

- Connect frontend hooks and forms with backend APIs.
- Use `fetch` (or Axios) to send HTTP requests to the Node.js server.
  ```javascript
  const handleQuerySubmit = async (queryData) => {
    try {
      const response = await fetch("https://your-backend-url/api/v1/queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryData),
      });
      const data = await response.json();
      console.log("Query submitted:", data);
    } catch (error) {
      console.error("Integration error:", error);
    }
  };
  ```
- Handle API responses and update React state to display data dynamically on the dashboard.

**Step 2: Test APIs**

- Open Postman.
- Test endpoints related to Analytics and Queries:
  - GET (Read Analytics Data)
  - POST (Create new Query)
- Verify correct JSON responses and proper error handling.

**Step 3: Deploy Backend**

- Uploaded backend code to GitHub.
- Connected GitHub repo to a cloud provider (e.g., Render/Railway).
- Added environment variables:
  - `DATABASE_URL` (PostgreSQL connection string)
  - `PORT`
- Deployed backend and run database migrations remotely.
- Verified API endpoint accessibility (e.g., `https://your-backend-url/api/v1/analytics`).

**Step 4: Deploy / Build Frontend**

- Configured Expo project for web deployment and native builds.
- Built the web version using:
  ```bash
  npx expo export:web
  ```
- Hosted the customized static web build on a platform like Vercel or Netlify.
- (Optional) Used Expo Application Services (EAS) to build APK/AAB for Android or IPA for iOS.

**Step 5: Final Testing**

- Check the full application flow across web and mobile simulator.
- Verify:
  - Form submission (Support Queries)
  - Data storage & retrieval (Dashboard Analytics loading from DB)
- Fix CORS or UI alignment errors if any.

**Step 6: Demonstration**

- Run the deployed application.
- Show all features (Sidebar navigation, Charts, AI Assistant mock, Query Management).
- Ensure it securely manages mock healthcare data and satisfies client constraints.

**Output / Result**

- Frontend and backend successfully integrated.
- APIs tested and working.
- Application backend hosted and frontend built for distribution.
- Complete SmartHeal dashboard working dynamically.

**Hosting Considerations (Important)**

1. Ensure the PostgreSQL database is securely accessible by the deployed Node.js server.
2. Update backend API URLs in the React Native frontend code before building.
3. Enable and correctly configure CORS in the Express backend to allow the deployed frontend domain to access the APIs.
4. Safely store sensitive data (like database URLs and API keys) using environment variables (`.env`).
5. Check application performance, load times, and responsiveness on multiple device sizes.

**Conclusion**
This project demonstrates a fully integrated full-stack web and mobile application suited for a modern healthcare environment. The Node + PostgreSQL backend provides a scalable data architecture, while React Native (Expo) delivers a fast, responsive, cross-platform user interface. This practical helped in understanding full-stack integration, API communication, cloud deployment, and real-world system readiness.
