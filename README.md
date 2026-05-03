# AI TickTock — Professional Timesheet Management

AI TickTock is a high-performance, enterprise-ready timesheet management application built with a modern tech stack. It features a robust service-oriented architecture, comprehensive data validation, and a premium user interface designed for speed and reliability.

## 🚀 Key Features

- **Dynamic Dashboard**: Advanced filtering by date range and status, multi-column sorting, and optimized pagination.
- **Service-Oriented Architecture**: Clean separation of concerns between UI, business logic, and data persistence.
- **Offline-First Resilience**: Intelligent read-through caching using `localStorage` ensures a snappy UI and basic offline availability.
- **Robust Data Fetching**: Custom API client with automatic retries, request deduplication, and standardized error handling.
- **Type-Safe Development**: End-to-end type safety using TypeScript and Zod for schema validation.

## 🛠️ Tech Stack

### Core Frameworks
- **Next.js 16.2.4 (App Router)**: Utilizing advanced features for routing and server-side rendering.
- **React 19.2.4**: Leveraging the latest React features for efficient state management and component rendering.
- **Tailwind CSS 4**: A modern CSS-in-JS alternative for high-performance styling and custom design tokens.

### Libraries & Utilities
- **Auth**: NextAuth.js 5.0.0-beta.30 (Credentials Provider).
- **Validation**: Zod 4.4.1 for strict runtime schema validation.
- **API Client**: Axios with custom interceptors for retry logic and error transformation.
- **Icons**: Lucide React for consistent and accessible iconography.
- **Testing**: Vitest and React Testing Library for comprehensive unit and integration testing.

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v20.x or later recommended)
- npm or pnpm

### Installation

1. **Clone and Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env.local` file in the root directory and add the necessary environment variables (refer to `.env.example` if available).
   ```env
   AUTH_SECRET=your_secret_here
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run Tests**:
   ```bash
   npm run test
   ```

## 📝 Assumptions & Notes

- **Data Source**: This version uses a mock data layer (`@/data/mock-timesheets.ts`). The architecture is designed to be easily switched to a real database (e.g., PostgreSQL/Prisma) by updating the API route handlers.
- **Authentication**: Uses a local credentials provider with mock users. In a production environment, this should be integrated with an OIDC provider or a secure database.
- **Next.js Version**: This project utilizes a specialized version of Next.js (v16). Standard patterns from v14/v15 have been adapted to fit this version's specific conventions.
- **Caching**: The `StorageService` implements a TTL (Time To Live) for cached data. If the cache expires, the app will automatically re-fetch from the API.

## ⏱️ Time Spent

Total estimated development time for this iteration: **8.5 Hours**

- **Architecture Design & Scaffolding**: 1.5h
- **API & Service Layer Implementation**: 2.0h
- **Dashboard & Filtering Logic**: 2.5h
- **Individual Timesheet CRUD & Stats**: 1.5h
- **Unit Testing & Documentation**: 1.0h

