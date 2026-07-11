const cacheKeys = {
  tenant(tenantId) {
    return `tenant:${tenantId}`;
  },
  tenantProjects(tenantId) {
    return `tenant:${tenantId}:projects`;
  },
  tenantMembers(tenantId) {
    return `tenant:${tenantId}:members`;
  },
  project(tenantId, projectId) {
    return `tenant:${tenantId}:project:${projectId}`;
  },
  projectMembers(tenantId, projectId) {
    return `tenant:${tenantId}:project:${projectId}:members`;
  },
  projectList(tenantId, userId, search, sort) {
    return `tenant:${tenantId}:projects:${userId}:${search || "all"}:${sort || "default"}`;
  },
  myProjects(tenantId, userId, search, dueDate) {
    return `tenant:${tenantId}:myProjects:${userId}:${search || "all"}:${dueDate || "all"}`;
  },
  tenantList(userId, search, role, sort) {
    return `tenant:list:${userId}:${search || "all"}:${role || "all"}:${sort || "default"}`;
  },
  tenantMembers(tenantId, search, role, sort) {
    return `tenant:${tenantId}:members:${search || "all"}:${role || "all"}:${sort || "default"}`;
  },
  projectAnnouncements(tenantId, projectId) {
    return `tenant:${tenantId}:project:${projectId}:announcements`;
  },
  taskList(tenantId, projectId, status, assignedTo, priority, search) {
    return `tenant:${tenantId}:project:${projectId}:tasks:${status || "all"}:${assignedTo || "all"}:${priority || "all"}:${search || "all"}`;
  },
  myTaskList(tenantId, projectId, userId, status, priority, search, sortBy, order) {
    return `tenant:${tenantId}:project:${projectId}:myTasks:${userId}:${status || "all"}:${priority || "all"}:${search || "all"}:${sortBy || "default"}:${order || "default"}`;
  },
  task(tenantId, projectId, taskId) {
    return `tenant:${tenantId}:project:${projectId}:task:${taskId}`;
  },
  tenantDashboard(tenantId) {
    return `tenant:${tenantId}:dashboard`;
  },
}

module.exports = cacheKeys