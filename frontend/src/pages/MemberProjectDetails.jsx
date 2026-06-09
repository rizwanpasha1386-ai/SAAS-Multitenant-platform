import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import { getMyProjectById } from "../api/project";
import { getMyTasks, getTaskById, updateTaskStatus } from "../api/task";

export default function MemberProjectDetails() {
  const { tenantId } = useWorkspace();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab,setActiveTab]=useState("tasks")
  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState("");

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState("");
  const [taskActionLoading, setTaskActionLoading] = useState(false);
  const [taskActionError, setTaskActionError] = useState("");
  const [taskActionSuccess, setTaskActionSuccess] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        setProjectLoading(true);
        setProjectError("");
        const res = await getMyProjectById(tenantId, projectId);
        setProject(res.data.project || null);
      } catch (err) {
        setProjectError(err.response?.data?.msg || err.response?.data?.message || "Failed to load project.");
      } finally {
        setProjectLoading(false);
      }
    };

    if (tenantId && projectId) {
      loadProject();
    }
  }, [tenantId, projectId]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setTasksLoading(true);
        setTasksError("");
        const res = await getMyTasks(tenantId, projectId);
        setTasks(res.data.data || []);
      } catch (err) {
        setTasksError(err.response?.data?.msg || err.response?.data?.message || "Failed to load tasks.");
      } finally {
        setTasksLoading(false);
      }
    };

    if (tenantId && projectId) {
      loadTasks();
    }
  }, [tenantId, projectId]);

  useEffect(() => {
    if (!selectedTask) return;
    setTaskStatus(selectedTask.status || "pending");
    setTaskActionError("");
    setTaskActionSuccess("");
  }, [selectedTask]);

  const handleSelectTask = async (taskId) => {
    try {
      setTaskActionLoading(true);
      setTaskActionError("");
      setTaskActionSuccess("");
      const res = await getTaskById(tenantId, projectId, taskId);
      setSelectedTask(res.data.task || null);
    } catch (err) {
      setTaskActionError(err.response?.data?.msg || err.response?.data?.message || "Failed to load task details.");
    } finally {
      setTaskActionLoading(false);
    }
  };

  const refreshTasks = async () => {
    try {
      setTasksLoading(true);
      setTasksError("");
      const res = await getMyTasks(tenantId, projectId);
      setTasks(res.data.data || []);
    } catch (err) {
      setTasksError(err.response?.data?.msg || err.response?.data?.message || "Failed to load tasks.");
    } finally {
      setTasksLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedTask) return;
    try {
      setTaskActionLoading(true);
      setTaskActionError("");
      setTaskActionSuccess("");
      await updateTaskStatus(tenantId, projectId, selectedTask._id, taskStatus);
      setTaskActionSuccess("Task status updated successfully.");
      await refreshTasks();
      setSelectedTask((prev) => prev && { ...prev, status: taskStatus });
    } catch (err) {
      setTaskActionError(err.response?.data?.msg || err.response?.data?.message || "Failed to update status.");
    } finally {
      setTaskActionLoading(false);
    }
  };

  const handleOpenChat = () => {
    setActiveTab("chat");
    navigate(`/tenant/${tenantId}/projects/${projectId}/chat`);
  };

  if (projectLoading) {
    return (
      <div className="ws-page" style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="ws-page">
        <div className="alert-banner error">
          <span>{projectError}</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="ws-page">
        <div className="empty-state">
          <div className="empty-state-title">Project not found</div>
          <p className="empty-state-desc">You cannot access this project or it no longer exists.</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className="ws-page">
      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
  <button
    className="ws-button"
    onClick={() => setActiveTab("tasks")}
    style={{ opacity: activeTab === "tasks" ? 1 : 0.7 }}
  >
    Tasks
  </button>

  <button
    className="ws-button"
    onClick={handleOpenChat}
    style={{ opacity: activeTab === "chat" ? 1 : 0.7 }}
  >
    Chat
  </button>
</div>

      <div className="ws-page-header" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="ws-page-title">{project.name}</h1>
          <p className="ws-page-subtitle">Tasks assigned to you in this project.</p>
        </div>
        <button className="ws-button" onClick={() => navigate(`/tenant/${tenantId}/my-projects`)}>
          Back to my projects
        </button>
      </div>

      <div className="ws-card" style={{ display: "grid", gap: 18 }}>
        <div>
          <h2 className="ws-card-title">Project details</h2>
          <p>{project.description || "No description provided."}</p>
        </div>

        <div className="ws-info-grid" style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <div className="ws-info-item">
            <span className="ws-info-label">Project ID</span>
            <div className="ws-info-value ws-mono">{project._id}</div>
          </div>
          <div className="ws-info-item">
            <span className="ws-info-label">Members</span>
            <div className="ws-info-value">{project.members?.length ?? 0}</div>
          </div>
          <div className="ws-info-item">
            <span className="ws-info-label">Created By</span>
            <div className="ws-info-value">{project.createdBy?.name || project.createdBy?.email || "Unknown"}</div>
          </div>
          <div className="ws-info-item">
            <span className="ws-info-label">Created At</span>
            <div className="ws-info-value">{new Date(project.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div className="ws-card" style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="ws-card-title">My Tasks</h2>
          <span className="ws-info-value">{tasks.length} assigned</span>
        </div>

        {tasksError && (
          <div className="alert-banner error">
            <span>{tasksError}</span>
          </div>
        )}

        {tasksLoading ? (
          <div className="spinner" />
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No tasks assigned</div>
            <p className="empty-state-desc">You don't have any tasks in this project yet.</p>
          </div>
        ) : (
          <div className="ws-table">
            <div className="ws-table-row ws-table-header">
              <div>Title</div>
              <div>Status</div>
              <div>Priority</div>
              <div>Due Date</div>
              <div />
            </div>
            {tasks.map((task) => (
              <div key={task._id} className="ws-table-row">
                <div>
                  <strong>{task.title}</strong>
                  <div className="ws-text-muted">{task.description || "No description"}</div>
                </div>
                <div>{task.status}</div>
                <div>{task.priority || "-"}</div>
                <div>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button className="ws-button" onClick={() => handleSelectTask(task._id)}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTask && (
        <div className="ws-card" style={{ display: "grid", gap: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 className="ws-card-title">Task detail</h2>
              <p className="ws-page-subtitle">Update the task status when your work progresses.</p>
            </div>
            <button className="ws-button ws-button--secondary" onClick={() => setSelectedTask(null)}>
              Close
            </button>
          </div>

          <div>
            <h3>{selectedTask.title}</h3>
            <p>{selectedTask.description || "No description provided."}</p>
          </div>

          <div className="ws-info-grid" style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <div className="ws-info-item">
              <span className="ws-info-label">Status</span>
              <div className="ws-info-value">{selectedTask.status}</div>
            </div>
            <div className="ws-info-item">
              <span className="ws-info-label">Priority</span>
              <div className="ws-info-value">{selectedTask.priority || "-"}</div>
            </div>
            <div className="ws-info-item">
              <span className="ws-info-label">Created</span>
              <div className="ws-info-value">{new Date(selectedTask.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {taskActionError && (
            <div className="alert-banner error">
              <span>{taskActionError}</span>
            </div>
          )}
          {taskActionSuccess && (
            <div className="alert-banner success">
              <span>{taskActionSuccess}</span>
            </div>
          )}

          <div style={{ display: "grid", gap: 12 }}>
            <label className="ws-field-label" htmlFor="taskStatus">Update status</label>
            <select
              id="taskStatus"
              className="ws-input"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <button className="ws-button" onClick={handleUpdateStatus} disabled={taskActionLoading}>
              {taskActionLoading ? "Updating…" : "Save status"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
