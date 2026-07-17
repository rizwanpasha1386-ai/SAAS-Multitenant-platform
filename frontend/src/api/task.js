import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

export const getProjectTasks = (tenantId, projectId, params = {}) =>
  API.get(`/task/${tenantId}/projects/${projectId}/tasks`, { params });

export const createTask = (tenantId, projectId, data) =>
  API.post(`/task/${tenantId}/projects/${projectId}/tasks`, data);

export const updateTask = (tenantId, projectId, taskId, data) =>
  API.patch(`/task/${tenantId}/projects/${projectId}/tasks/${taskId}`, data);

export const deleteTask = (tenantId, projectId, taskId) =>
  API.delete(`/task/${tenantId}/projects/${projectId}/tasks/${taskId}`);

export const reassignTask = (tenantId, projectId, taskId, assignedTo) =>
  API.patch(`/task/${tenantId}/projects/${projectId}/tasks/${taskId}/assign`, { assignedTo });

export const getMyTasks = (tenantId, projectId, params = {}) =>
  API.get(`/task/${tenantId}/projects/${projectId}/my-tasks`, { params });

export const getTaskById = (tenantId, projectId, taskId) =>
  API.get(`/task/${tenantId}/projects/${projectId}/tasks/${taskId}`);

export const updateTaskStatus = (tenantId, projectId, taskId, status) =>
  API.patch(`/task/${tenantId}/projects/${projectId}/tasks/${taskId}/updatestatus`, { status });
