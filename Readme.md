📘 Multi-Tenant SaaS Project Management System

A full-stack scalable SaaS application built with Node.js, Express, MongoDB, and a modern frontend.
It supports multi-tenant architecture and role-based access control (RBAC) for managing organizations, projects, members, and tasks.

🚀 Features
🏢 Multi-Tenant Architecture
Each tenant (organization) is fully isolated
Users can belong to multiple tenants
Tenant-level access control
🔐 Authentication & Authorization
JWT-based authentication (stored in HTTP-only cookies)
Secure middleware-based route protection
Role-Based Access Control (RBAC):
Owner → Full tenant control
Admin → Manage projects & tasks
Member → Access assigned work
📁 Project Management
Create, update, delete projects
Assign members to projects
Role-based access (Admin vs Member)
Search projects by name
Filter projects by due date
👥 Member Management
Add/remove tenant members
Assign roles (Owner/Admin/Member)
Manage project members
Search & filter members
📋 Task Management
Create, update, delete tasks
Assign/reassign tasks
Filter tasks by:
Status
Priority
Assigned user
Member Capabilities:
View assigned tasks
Update task status
🔍 Query Features
Search using $regex (case-insensitive)
Filtering using:
$gte, $lte (date range)
$in (multiple values)
Sorting support (asc / desc)
✅ Validation Layer
Joi-based request validation
Centralized validation middleware:
validate(schema, 'body' | 'params' | 'query')
🧱 Tech Stack
Backend
Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
Joi Validation
Frontend
React (Vite)
Axios (API communication)
📁 Project Structure
multi-tenant-saas/
├── backend/
│   ├── src/
│   ├── app.js
│   ├── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── README.md
└── .gitignore
🌐 API Base Paths
/api/auth
/api/tenant
/api/project
/api/task
📡 API Endpoints
🔑 Auth
POST /api/auth/signup
POST /api/auth/login
🏢 Tenant
GET    /api/tenant?search=&role=
POST   /api/tenant
GET    /api/tenant/:tenantId
PATCH  /api/tenant/:tenantId
DELETE /api/tenant/:tenantId
👑 Owner Actions
POST   /api/tenant/:tenantId/createAdmin
POST   /api/tenant/:tenantId/add-members
GET    /api/tenant/:tenantId/members
DELETE /api/tenant/:tenantId/members/:memberId
PATCH  /api/tenant/:tenantId/role
📁 Projects
POST   /api/project/:tenantId/projects
GET    /api/project/:tenantId/projects
GET    /api/project/:tenantId/projects/:projectId
PATCH  /api/project/:tenantId/projects/:projectId
DELETE /api/project/:tenantId/projects/:projectId
👥 Project Members
POST   /api/project/:tenantId/projects/:projectId/members
DELETE /api/project/:tenantId/projects/:projectId/members/:memberId
GET    /api/project/:tenantId/projects/:projectId/members
📋 Tasks
POST   /api/task/:tenantId/projects/:projectId/tasks
GET    /api/task/:tenantId/projects/:projectId/tasks
PATCH  /api/task/:tenantId/projects/:projectId/tasks/:taskId
DELETE /api/task/:tenantId/projects/:projectId/tasks/:taskId
👤 Member Task Access
GET    /api/task/:tenantId/projects/:projectId/my-tasks
PATCH  /api/task/:tenantId/projects/:projectId/tasks/:taskId/updatestatus
🔐 Roles & Permissions
Action	             Owner   Admin	Member
Manage Tenant	      ✅	    ❌	 ❌
Create Project	      ❌	    ✅	 ❌
Manage Projects	      ❌	    ✅	 ❌
Add Members	          ❌	    ✅	 ❌
Create Tasks	      ❌	    ✅	 ❌
Update Tasks	      ❌	    ✅	 ❌
Update Task Status	  ❌	    ❌	 ✅
View Projects	      ❌	    ✅	 ✅
🧠 Key Design Decisions
RESTful API Design
Resource-based endpoints with hierarchical structure
(tenant → project → task)
RBAC Enforcement
Middleware-based role validation
Data Integrity
Users must belong to tenant
Tasks assigned only to project members
Scalable Architecture
Modular middleware system:
auth
isOwner, isAdmin, isMember
validate
⚙️ Setup & Run
Backend
cd backend
npm install
npm run dev
Frontend
cd frontend
npm install
npm run dev
🔮 Future Improvements
API Versioning (/api/v1)
Rate Limiting & Security (Helmet, CORS)
Logging (Winston / Morgan)
Unit & Integration Testing
Swagger API Docs
Notifications 🔔
File Uploads 📎
Activity Logs 📜
Redis Caching ⚡
🏁 Conclusion

This project demonstrates:

Multi-tenant SaaS architecture
Role-Based Access Control (RBAC)
Scalable backend design
Full-stack integration
Real-world features like filtering, search, and task workflows
👨‍💻 Author

Rizwan Pasha