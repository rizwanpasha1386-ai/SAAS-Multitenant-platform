# Anti Gravity Project

A multi-tenant workspace and project management application built with Node.js, Express, MongoDB, and React.

## Overview

This app supports tenant-based organizations with role-based access control, workspace dashboards, project management, and member task workflows.

## Current Features

- Authentication
  - Signup and login
  - Session validation via `/api/auth/me`
  - Protected frontend routing with `ProtectedRoute`
- Multi-tenant workspace support
  - Create and list tenants/workspaces
  - Search tenants by name
  - Filter workspaces by user role (owner/admin/member)
- Role-based access control
  - Owner: full tenant control and member management
  - Admin: project and task management within a tenant
  - Member: view assigned projects and tasks, update task status
- Workspace pages
  - Workspace home dashboard
  - Workspace settings
  - Tenant member management (owner only)
- Project management
  - Create, update, delete projects
  - Assign members to projects
  - View project details
- Task management
  - Create, update, delete tasks
  - Assign tasks to users
  - Members can update status of assigned tasks
- Member-specific portal
  - `GET /tenant/:tenantId/my-projects`
  - `GET /tenant/:tenantId/my-projects/:projectId`

## Frontend Routes

- `/` — Home
- `/login` — Login page
- `/signup` — Signup page
- `/tenants` — Workspace dashboard
- `/tenant/:tenantId` — Workspace home
- `/tenant/:tenantId/settings` — Workspace settings
- `/tenant/:tenantId/members` — Member management
- `/tenant/:tenantId/projects` — Project list
- `/tenant/:tenantId/projects/:projectId` — Project details
- `/tenant/:tenantId/my-projects` — Member project list
- `/tenant/:tenantId/my-projects/:projectId` — Member project details

## API Summary

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Tenants
- `GET /api/tenant`
- `POST /api/tenant`
- `GET /api/tenant/:tenantId`
- `PATCH /api/tenant/:tenantId`
- `DELETE /api/tenant/:tenantId`
- `POST /api/tenant/:tenantId/createAdmin`
- `POST /api/tenant/:tenantId/add-members`
- `GET /api/tenant/:tenantId/members`
- `DELETE /api/tenant/:tenantId/members/:memberId`
- `PATCH /api/tenant/:tenantId/role`

### Projects
- `POST /api/project/:tenantId/projects`
- `GET /api/project/:tenantId/projects`
- `GET /api/project/:tenantId/projects/:projectId`
- `PATCH /api/project/:tenantId/projects/:projectId`
- `DELETE /api/project/:tenantId/projects/:projectId`
- `POST /api/project/:tenantId/projects/:projectId/members`
- `DELETE /api/project/:tenantId/projects/:projectId/members/:memberId`
- `GET /api/project/:tenantId/projects/:projectId/members`

### Tasks
- `POST /api/task/:tenantId/projects/:projectId/tasks`
- `GET /api/task/:tenantId/projects/:projectId/tasks`
- `PATCH /api/task/:tenantId/projects/:projectId/tasks/:taskId`
- `DELETE /api/task/:tenantId/projects/:projectId/tasks/:taskId`
- `GET /api/task/:tenantId/projects/:projectId/my-tasks`
- `PATCH /api/task/:tenantId/projects/:projectId/tasks/:taskId/updatestatus`

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React, Vite, React Router, Axios
- Validation: Joi
- Auth: JWT via HTTP-only cookies

## Project Structure

```
backend/
  src/
    app.js
    controllers/
    middlewares/
    models/
    routes/
    validations/
  package.json
frontend/
  src/
    api/
    components/
    context/
    pages/
  package.json
README.md
```

## Setup

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Notes

- Tenant access is role-based: owners have tenant control, admins manage projects/tasks, members access assigned work.
- Member views are separated under `/tenant/:tenantId/my-projects`.
- Owner/Admin workflows use `/tenant/:tenantId/projects`.

## Suggested Improvements

- Improve role-aware navigation and UI messaging
- Add tests for backend routes and frontend flows
- Add better error handling and notifications
- Add API docs and request examples
