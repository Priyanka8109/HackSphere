# Implementation Plan: HackSphere (Full-Stack Hackathon Platform)

**HackSphere** is an all-in-one Hackathon Management & Real-Time Community Collaboration Platform designed to satisfy all **10 Laboratory Experiments** in a production-ready MERN & DevOps stack.

---

## Mapping HackSphere to Experiments 1–10

| Exp | Milestone | Implementation in HackSphere |
| :--- | :--- | :--- |
| **Exp 1** | Responsive UI (Tailwind CSS) | Modern, responsive dark/light UI: Landing Page, Auth (Login/Register), Hacker Dashboard, Organizer/Admin Dashboard, Hackathon Details & Project Submission. |
| **Exp 2** | React Hooks | `useState`, `useEffect`, `useMemo`, `useCallback`, plus custom hooks: `useAuth`, `useFetch`, `useSocket`, `useNotification`. Form handling & validation. |
| **Exp 3** | Redux Toolkit / Context | Global state for auth session, active hackathon filters, real-time notification alerts, and team workspace. |
| **Exp 4** | REST API + MongoDB + Mongoose | Express.js REST API with Mongoose schemas: `User`, `Hackathon`, `Team`, `Submission`, `Announcement`. Complete CRUD operations. |
| **Exp 5** | Secure REST APIs | Centralized error handler, request validation middleware (`express-validator` / `zod`), CORS, rate limiting, and standard HTTP response wrappers. |
| **Exp 6** | JWT Auth & RBAC | JWT access tokens, bcrypt password hashing, Protected Routes on frontend & backend, Role-Based Access Control (`Organizer`/`Admin` vs `Hacker`). |
| **Exp 7** | Dockerization | Optimized multi-stage `Dockerfile` for Backend (Node.js) and Frontend (React + Vite + Nginx). |
| **Exp 8** | WebSockets (Socket.io) | Real-time live hackathon announcements, team discussion room chat, and instant broadcast notifications. |
| **Exp 9** | Multi-Container Docker Compose | `docker-compose.yml` linking Frontend, Backend, and MongoDB with health checks and environment configuration. |
| **Exp 10** | CI/CD Automation | GitHub Actions workflow (`.github/workflows/ci-cd.yml`) to run linting, tests, build Docker images, and prepare deployment to Render/Vercel. |

---

## User Review Required

> [!IMPORTANT]
> **Tech Stack Summary:**
> - **Frontend:** React (Vite) + Tailwind CSS + Lucide Icons + Redux Toolkit + Socket.io-client + Axios + React Router DOM
> - **Backend:** Node.js + Express.js + MongoDB (Mongoose) + Socket.io + JWT + Bcryptjs + Express-Validator
> - **DevOps:** Docker, Docker Compose, GitHub Actions CI/CD workflow, Nginx

Please review the architecture and directory structure below.

---

## Architecture & Directory Structure

```
Mini Project/
├── client/                     # Frontend (React + Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── api/                # Axios client & API endpoints
│   │   ├── components/         # Navbar, Footer, Cards, Modals, ProtectedRoute
│   │   ├── context/ / redux/   # Redux Toolkit store & slices (authSlice, hackathonSlice)
│   │   ├── hooks/              # Custom hooks (useAuth, useSocket, useFetch)
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Hackathons, TeamChat, AdminPanel
│   │   ├── types/ / utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind directives
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend (Node.js + Express + MongoDB + Socket.io)
│   ├── src/
│   │   ├── config/             # DB connection (db.js)
│   │   ├── controllers/        # authController, hackathonController, teamController, submissionController
│   │   ├── middlewares/        # authMiddleware (JWT & RBAC), errorHandler, validateRequest
│   │   ├── models/             # User, Hackathon, Team, Submission, Message
│   │   ├── routes/             # authRoutes, hackathonRoutes, teamRoutes, submissionRoutes
│   │   ├── sockets/            # socketHandler.js (Real-time announcements & team chat)
│   │   ├── utils/              # Token generation, validators
│   │   └── server.js           # Server & Socket.io entry point
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions CI/CD Pipeline (Exp 10)
├── docker-compose.yml          # Multi-container orchestration (Exp 9)
└── README.md                   # Complete documentation with all 10 experiment reports
```

---

## Proposed Changes

### 1. Backend Service (`server/`)
- Initialize Node.js Express server with ES modules.
- Set up MongoDB connection via Mongoose (`db.js`).
- Models: `User` (with roles: `hacker`, `organizer`), `Hackathon`, `Team`, `Submission`, `Announcement`.
- Implement JWT Auth (Register, Login, Profile) with password hashing.
- Implement REST CRUD APIs for Hackathons, Teams, and Project Submissions.
- Add request validation (`express-validator`), standard error handling middleware, and rate limiter.
- Set up Socket.io server for real-time announcements & live team chat rooms.

### 2. Frontend Application (`client/`)
- Initialize React + Vite project with Tailwind CSS.
- Configure Redux Toolkit store (`authSlice`, `hackathonSlice`, `notificationSlice`).
- Build reusable custom hooks: `useAuth`, `useSocket`, `useFetch`.
- Build UI Pages:
  - **Landing Page**: Hero banner, live stats, featured hackathons.
  - **Auth Pages**: Login & Register with responsive forms & validation feedback.
  - **Hacker Dashboard**: My registered hackathons, team status, project submissions.
  - **Organizer / Admin Dashboard**: Create/edit hackathons, review submissions, publish live announcements.
  - **Live Chat / Team Room**: Real-time messaging with Socket.io.
- Add Role-Based Protected Routes for navigation.

### 3. DevOps & Deployment
- `server/Dockerfile` (Node.js runtime, non-root user).
- `client/Dockerfile` + `client/nginx.conf` (Multi-stage build with Nginx for static serving).
- `docker-compose.yml` defining `client`, `server`, and `mongo` services with network isolation.
- `.github/workflows/ci-cd.yml` defining automated test, lint, build, and deploy steps.

---

## Verification Plan

### Automated Verification
- Backend tests: Health check route, authentication endpoint tests, CRUD route tests.
- Frontend build: `npm run build` with zero linting/compilation errors.
- Docker: Verify `docker-compose up --build` launches all 3 containers cleanly.

### Manual Verification
- Test registration and login with both Hacker and Organizer roles.
- Verify Organizer can create a Hackathon and Hacker can submit a project.
- Open two browser tabs to verify real-time Socket.io chat messages and announcement notifications instantly propagate.
