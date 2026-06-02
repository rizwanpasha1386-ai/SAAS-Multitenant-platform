import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// ──────────────────────────────────────────
// Tenant (Workspace) Routes
// ──────────────────────────────────────────

// GET /api/tenant/:tenantId  → viewTenant
export const getTenant = (tenantId) =>
  API.get(`/tenant/${tenantId}`);

// PATCH /api/tenant/:tenantId  → updateTenant
export const updateTenant = (tenantId, data) =>
  API.patch(`/tenant/${tenantId}`, data);

// DELETE /api/tenant/:tenantId  → deleteTenant
export const deleteTenant = (tenantId) =>
  API.delete(`/tenant/${tenantId}`);

// ──────────────────────────────────────────
// Member Management Routes
// ──────────────────────────────────────────

// GET /api/tenant/:tenantId/members  → getTenantMembers
export const getMembers = (tenantId, params = {}) =>
  API.get(`/tenant/${tenantId}/members`, { params });

// POST /api/tenant/:tenantId/add-members  → addTenantMembers
export const addMembers = (tenantId, members) =>
  API.post(`/tenant/${tenantId}/add-members`, { members });

// DELETE /api/tenant/:tenantId/members/:memberId  → deleteTenantMember
export const deleteMember = (tenantId, memberId) =>
  API.delete(`/tenant/${tenantId}/members/${memberId}`);

// PATCH /api/tenant/:tenantId/role  → updateMemberRole
export const updateMemberRole = (tenantId, memberId, role) =>
  API.patch(`/tenant/${tenantId}/role`, { memberId, role });

// POST /api/tenant/:tenantId/createAdmin  → createAdmin
export const createAdmin = (tenantId, email) =>
  API.post(`/tenant/${tenantId}/createAdmin`, { email });
