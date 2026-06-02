import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export const getProjects = (tenantId, params = {}) =>
  API.get(`/project/${tenantId}/projects`, { params });

export const createProject = (tenantId, data) =>
  API.post(`/project/${tenantId}/projects`, data);

export const deleteProject = (tenantId, projectId) =>
  API.delete(`/project/${tenantId}/projects/${projectId}`);

export const getProjectById = (tenantId, projectId) =>
  API.get(`/project/${tenantId}/projects/${projectId}`);

export const updateProject = (tenantId, projectId, data) =>
  API.patch(`/project/${tenantId}/projects/${projectId}`, data);

export const getProjectMembers = (tenantId, projectId, params = {}) =>
  API.get(`/project/${tenantId}/projects/${projectId}/members`, { params });

export const addProjectMembers = (tenantId, projectId, members) =>
  API.post(`/project/${tenantId}/projects/${projectId}/members`, { members });

export const removeProjectMember = (tenantId, projectId, memberId) =>
  API.delete(`/project/${tenantId}/projects/${projectId}/members/${memberId}`);

export const getMyProjects = (tenantId, params = {}) =>
  API.get(`/project/${tenantId}/my-projects`, { params });

export const getMyProjectById = (tenantId, projectId) =>
  API.get(`/project/${tenantId}/my-projects/${projectId}`);
