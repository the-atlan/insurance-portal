# Smart Insurance Application Portal

[cite_start]This project is a dynamic form-generation application built with React and Next.js, created as a solution for the Frontend Developer Code Assignment. [cite: 1, 32] [cite_start]The portal fetches form structures from an API [cite: 3, 9, 34, 40][cite_start], renders them with complex conditional logic [cite: 6, 37][cite_start], and allows users to view and manage their submissions in a fully-featured, customizable table.

**[➡️ View Live Demo](https://your-deployment-link.vercel.app)** *(<-- Replace with your Vercel/Netlify link!)*

---

## ✨ Features Implemented

This application successfully implements all core and several bonus features outlined in the assignment.

### Core Features

* [cite_start]**Dynamic Form Rendering**: The application fetches form structures from an API and renders them dynamically without any hardcoded layouts.
* [cite_start]**Conditional Field Logic**: Form fields dynamically appear and disappear based on user input, as specified in the requirements  (e.g., the "smoker" field dependency).
* [cite_start]**Nested Sections (Groups)**: The renderer correctly handles `group` field types, creating visually distinct, nested sections within the form for items like "Address" or "Personal Information".
* [cite_start]**API-Driven Dynamic Options**: Select fields can dynamically fetch their options from a separate API endpoint based on the value of another field  (e.g., fetching states after a country is selected).
* [cite_start]**Customizable Submissions List**: A feature-rich table displays all submitted applications  with the following capabilities:
    * [cite_start]**Column Selection**: Users can dynamically choose which columns are visible in the table.
    * [cite_start]**Sorting, Searching, and Pagination**: The table includes robust controls for sorting by any column, a full-text search across all data, and pagination for large datasets.
* [cite_start]**Data Validation & Submission**: All form data is validated according to rules defined in the schema before being sent to a submission API.
* [cite_start]**Responsive Design**: The entire application, including the header, forms, and data table, is fully responsive and provides a great user experience on both desktop and mobile devices.

### Bonus Features

* [cite_start]**Autosave Drafts**: User input in a form is automatically saved to the browser's `localStorage` and restored if the user leaves and returns, preventing data loss.
* [cite_start]**Dark Mode**: A theme toggle in the header allows users to switch between light and dark modes. The application theme, including custom components, is fully responsive to this change.
* [cite_start]**Localization (i18n)**: The UI supports multiple languages (English and Persian). The application handles LTR/RTL layout changes and dynamically switches all text based on user selection.
* [cite_start]**Unit & Component Testing**: The project includes a comprehensive test suite using **Jest** and **React Testing Library**, covering pure logic functions (mappers), component rendering, and user interactions.

---

## 🛠️ Tech Stack & Architectural Decisions

* **Framework:** React, Next.js (App Router)
* **UI Library:** Ant Design
* **State Management:** React Hooks (`useState`, `useEffect`, etc.) & TanStack Query (React Query) for server state.
* **Data Fetching:** A custom three-layer architecture was implemented:
    1.  **Repository Pattern:** A single layer responsible for all `fetch` API calls.
    2.  **Service Layer:** Contains business logic and data transformations.
    3.  **Custom Hooks:** Connects the service layer to the UI using TanStack Query for caching, mutations, and automatic UI updates.
* **Schema Transformation (Adapter Pattern):** A dedicated `toFormSchema` mapper function transforms the raw, simplified API response into the rich `FormSchema` required by the UI components. This decouples the frontend from the specific API structure.
* **Component Architecture:**
    * **`FormGenerator`:** A powerful orchestrator component that renders form layouts based on the schema.
    * **`FormField`:** A recursive component that renders individual fields, handling all conditional logic and dynamic updates.
* **Styling:** CSS Modules
* **Testing:** Jest & React Testing Library

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or later)
* npm or yarn

### Setup and Running Locally

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd [project-folder]
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

### Running Tests

To run the complete test suite:
```bash
npm test
```

---

## 📝 API Usage & Assumptions

* [cite_start]**API Endpoints**: The application interacts with the three specified endpoints for fetching form structures (`GET /api/insurance/forms` [cite: 21, 52][cite_start]), submitting data (`POST /api/insurance/forms/submit` [cite: 22, 53][cite_start]), and fetching submissions (`GET /api/insurance/forms/submissions` ).
* **Assumptions Made**:
    * It was assumed that the raw API response for forms contains a flat or nested list of fields. A default layout of **one field per row (`span: 24`)** was applied during the transformation process, but the `FormGenerator` is built to handle any grid layout defined in a fully-formed `FormSchema`.
    * [cite_start]The architecture was intentionally designed with a **separation of concerns** (Repository, Service, Hooks) to demonstrate best practices for building scalable applications.
    * The parent page component (`ApplyPage`) is responsible for all "business logic" (e.g., handling what happens after a form is submitted or how dynamic options are fetched), keeping the `FormGenerator` a pure, reusable UI component.