import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import {
  getProjectById,
  updateProject,
  getProjectMembers,
  addProjectMembers,
  removeProjectMember,
} from "../api/project";
import {
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask,
  reassignTask,
} from "../api/task";

export default function ProjectDetails() {
  const { tenantId, workspace } = useWorkspace();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [membersError, setMembersError] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberIds, setMemberIds] = useState("");
  const [memberActionLoading, setMemberActionLoading] = useState(false);
  const [addMemberSuccess, setAddMemberSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("project");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState(1);
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskActionLoading, setTaskActionLoading] = useState(false);
  const [taskSuccess, setTaskSuccess] = useState("");
  const [taskError, setTaskError] = useState("");
  
  const handleOpenGroupDiscussion = () => {
  setActiveTab("groupDiscussion");
  navigate(`/tenant/${tenantId}/projects/${projectId}/chat`);
  };

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getProjectById(tenantId, projectId);
        setProject(res.data.project || res.data.data || null);
      } catch (err) {
        setError(err.response?.data?.msg || err.response?.data?.message || "Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    if (tenantId && projectId) {
      loadProject();
    }
  }, [tenantId, projectId]);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setMembersLoading(true);
        setMembersError("");
        const res = await getProjectMembers(tenantId, projectId);
        setMembers(res.data.data || []);
      } catch (err) {
        setMembersError(err.response?.data?.msg || err.response?.data?.message || "Failed to load members.");
      } finally {
        setMembersLoading(false);
      }
    };

    if (tenantId && projectId) {
      loadMembers();
    }
  }, [tenantId, projectId]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setTasksLoading(true);
        setTasksError("");
        const res = await getProjectTasks(tenantId, projectId);
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
    if (!project) return;
    setEditName(project.name || "");
    setEditDescription(project.description || "");
    setEditDueDate(project.duedate ? new Date(project.duedate).toISOString().slice(0, 10) : "");
  }, [project]);

  const handleUpdateProject = async () => {
    try {
      setUpdateLoading(true);
      setUpdateError("");
      setUpdateSuccess("");
      const res = await updateProject(tenantId, projectId, {
        name: editName,
        description: editDescription,
        duedate: editDueDate || null,
      });
      const updated = res.data.project || res.data.data || null;
      setProject(updated || {
        ...project,
        name: editName,
        description: editDescription,
        duedate: editDueDate || null,
      });
      setUpdateSuccess("Project updated successfully.");
    } catch (err) {
      setUpdateError(err.response?.data?.msg || err.response?.data?.message || "Failed to save project.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const resetTaskForm = () => {
    setSelectedTask(null);
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority(1);
    setTaskDueDate("");
    setTaskAssignedTo("");
    setTaskError("");
    setTaskSuccess("");
  };

  const refreshTasks = async () => {
    try {
      setTasksLoading(true);
      setTasksError("");
      const res = await getProjectTasks(tenantId, projectId);
      setTasks(res.data.data || []);
    } catch (err) {
      setTasksError(err.response?.data?.msg || err.response?.data?.message || "Failed to load tasks.");
    } finally {
      setTasksLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      setTaskError("Task title is required.");
      return;
    }

    try {
      setTaskActionLoading(true);
      setTaskError("");
      setTaskSuccess("");
      await createTask(tenantId, projectId, {
        title: taskTitle,
        description: taskDescription,
        priority: Number(taskPriority),
        dueDate: taskDueDate || null,
        assignedTo: taskAssignedTo || null,
      });
      setTaskSuccess("Task created successfully.");
      resetTaskForm();
      await refreshTasks();
    } catch (err) {
      setTaskError(err.response?.data?.msg || err.response?.data?.message || "Failed to create task.");
    } finally {
      setTaskActionLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setTaskTitle(task.title || "");
    setTaskDescription(task.description || "");
    setTaskPriority(task.priority || 1);
    setTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "");
    setTaskAssignedTo(task.assignedTo?._id || "");
    setTaskError("");
    setTaskSuccess("");
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    try {
      setTaskActionLoading(true);
      setTaskError("");
      setTaskSuccess("");
      await updateTask(tenantId, projectId, selectedTask._id, {
        title: taskTitle,
        description: taskDescription,
        priority: Number(taskPriority),
        dueDate: taskDueDate || null,
      });
      setTaskSuccess("Task updated successfully.");
      await refreshTasks();
    } catch (err) {
      setTaskError(err.response?.data?.msg || err.response?.data?.message || "Failed to update task.");
    } finally {
      setTaskActionLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setTaskActionLoading(true);
      setTaskError("");
      setTaskSuccess("");
      await deleteTask(tenantId, projectId, taskId);
      setTaskSuccess("Task deleted successfully.");
      if (selectedTask?._id === taskId) {
        resetTaskForm();
      }
      await refreshTasks();
    } catch (err) {
      setTaskError(err.response?.data?.msg || err.response?.data?.message || "Failed to delete task.");
    } finally {
      setTaskActionLoading(false);
    }
  };

  const handleReassignTask = async () => {
    if (!selectedTask) return;
    if (!taskAssignedTo) {
      setTaskError("Select a user to assign the task to.");
      return;
    }

    try {
      setTaskActionLoading(true);
      setTaskError("");
      setTaskSuccess("");
      await reassignTask(tenantId, projectId, selectedTask._id, taskAssignedTo);
      setTaskSuccess("Task reassigned successfully.");
      await refreshTasks();
    } catch (err) {
      setTaskError(err.response?.data?.msg || err.response?.data?.message || "Failed to reassign task.");
    } finally {
      setTaskActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ws-page" style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="ws-page">
        <div className="alert-banner error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="ws-page">
        <div className="empty-state">
          <div className="empty-state-title">Project not found</div>
          <p className="empty-state-desc">This project could not be loaded. Please go back and try again.</p>
        </div>
      </div>
    );
  }

  const handleAddMembers = async () => {
    const memberList = memberIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (!memberList.length) {
      setMembersError("Enter one or more member user IDs.");
      return;
    }

    try {
      setMemberActionLoading(true);
      setMembersError("");
      setAddMemberSuccess("");
      await addProjectMembers(tenantId, projectId, memberList);
      setAddMemberSuccess("Members added successfully.");
      setMemberIds("");
      const membersRes = await getProjectMembers(tenantId, projectId);
      setMembers(membersRes.data.data || []);
      setProject((prev) => ({
        ...prev,
        members: [...(prev.members || []), ...memberList.map((id) => ({ _id: id }))],
      }));
    } catch (err) {
      setMembersError(err.response?.data?.msg || err.response?.data?.message || "Failed to add members.");
    } finally {
      setMemberActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      setMemberActionLoading(true);
      setMembersError("");
      await removeProjectMember(tenantId, projectId, memberId);
      setMembers((prev) => prev.filter((member) => member._id !== memberId));
      setProject((prev) => ({
        ...prev,
        members: (prev.members || []).filter((member) => member._id !== memberId),
      }));
    } catch (err) {
      setMembersError(err.response?.data?.msg || err.response?.data?.message || "Failed to remove member.");
    } finally {
      setMemberActionLoading(false);
    }
  };

  return (
    <div className="ws-page">
      <div className="ws-page-header">
        <div>
          <h1 className="ws-page-title">{project.name}</h1>
          <p className="ws-page-subtitle">Project workspace for {workspace?.name || tenantId}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <button
          className="ws-button"
          onClick={() => setActiveTab("project")}
          style={{ opacity: activeTab === "project" ? 1 : 0.7 }}
        >
          Project
        </button>
        <button
          className="ws-button"
          onClick={() => setActiveTab("members")}
          style={{ opacity: activeTab === "members" ? 1 : 0.7 }}
        >
          Members
        </button>
        <button
          className="ws-button"
          onClick={() => setActiveTab("tasks")}
          style={{ opacity: activeTab === "tasks" ? 1 : 0.7 }}
        >
          Tasks
        </button>
        <button
        className="ws-button"
        onClick={handleOpenGroupDiscussion}
        style={{ opacity: activeTab === "groupDiscussion" ? 1 : 0.7 }}
        >
  Group Discussion
</button>
      </div>

      {activeTab === "project" ? (
        <div className="ws-card">
          <div style={{ display: "grid", gap: 24 }}>
            <div>
              <h2 className="ws-card-title">Project Overview</h2>
              <p>{project.description || "No description provided."}</p>
            </div>

            <div className="ws-info-grid" style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              <div className="ws-info-item">
                <span className="ws-info-label">Project ID</span>
                <div className="ws-info-value ws-mono">{project._id}</div>
              </div>
              <div className="ws-info-item">
                <span className="ws-info-label">Due Date</span>
                <div className="ws-info-value">{project.duedate ? new Date(project.duedate).toLocaleDateString() : "Not set"}</div>
              </div>
              <div className="ws-info-item">
                <span className="ws-info-label">Members</span>
                <div className="ws-info-value">{members.length}</div>
              </div>
              <div className="ws-info-item">
                <span className="ws-info-label">Created By</span>
                <div className="ws-info-value">{project.createdBy?.name || project.createdBy?.email || "Unknown"}</div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <h2 className="ws-card-title">Update Project</h2>
              {updateError && (
                <div className="alert-banner error">
                  <span>{updateError}</span>
                </div>
              )}
              {updateSuccess && (
                <div className="alert-banner success">
                  <span>{updateSuccess}</span>
                </div>
              )}
              <label className="ws-field-label" htmlFor="editName">
                Name
              </label>
              <input
                id="editName"
                className="ws-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <label className="ws-field-label" htmlFor="editDescription">
                Description
              </label>
              <textarea
                id="editDescription"
                className="ws-input"
                rows={4}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <label className="ws-field-label" htmlFor="editDueDate">
                Due Date
              </label>
              <input
                id="editDueDate"
                type="date"
                className="ws-input"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />
              <button className="ws-button" onClick={handleUpdateProject} disabled={updateLoading}>
                {updateLoading ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === "members" ? (
        <div className="ws-card">
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="ws-card-title">Project Members</h2>
              <button className="ws-button" onClick={() => setShowAddMember((prev) => !prev)}>
                {showAddMember ? "Hide" : "Add Members"}
              </button>
            </div>

            {membersError && (
              <div className="alert-banner error">
                <span>{membersError}</span>
              </div>
            )}

            {showAddMember && (
              <div className="ws-card" style={{ padding: 16, background: "#fff" }}>
                <label className="ws-field-label" htmlFor="memberIds">
                  Member IDs (comma-separated)
                </label>
                <input
                  id="memberIds"
                  value={memberIds}
                  onChange={(e) => setMemberIds(e.target.value)}
                  className="ws-input"
                  placeholder="userId1, userId2"
                />
                <button
                  className="ws-button"
                  onClick={handleAddMembers}
                  disabled={memberActionLoading}
                  style={{ marginTop: 12 }}
                >
                  {memberActionLoading ? "Adding…" : "Add Members"}
                </button>
                {addMemberSuccess && <div className="alert-banner success"><span>{addMemberSuccess}</span></div>}
              </div>
            )}

            <div>
              {membersLoading ? (
                <div className="spinner" />
              ) : members.length ? (
                <div className="ws-table">
                  <div className="ws-table-row ws-table-header">
                    <div>Name / Email</div>
                    <div>Role</div>
                    <div />
                  </div>
                  {members.map((member) => (
                    <div key={member._id} className="ws-table-row">
                      <div>
                        <strong>{member.name || member.email || "Unnamed"}</strong>
                        <div className="ws-text-muted">{member.email || "No email"}</div>
                      </div>
                      <div>{member.role || "Member"}</div>
                      <div>
                        <button
                          className="ws-button ws-button--danger"
                          onClick={() => handleRemoveMember(member._id)}
                          disabled={memberActionLoading}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-title">No members yet</div>
                  <p className="empty-state-desc">Add project members by user ID.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="ws-card">
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="ws-card-title">Task Dashboard</h2>
              <button className="ws-button" onClick={resetTaskForm}>
                New Task
              </button>
            </div>

            {(taskError || taskSuccess) && (
              <div className={`alert-banner ${taskError ? "error" : "success"}`}>
                <span>{taskError || taskSuccess}</span>
              </div>
            )}

            <div className="ws-card" style={{ padding: 18, background: "#fff" }}>
              <h3 className="ws-card-title">{selectedTask ? "Edit Task" : "Create Task"}</h3>
              <div style={{ display: "grid", gap: 12 }}>
                <label className="ws-field-label" htmlFor="taskTitle">
                  Title
                </label>
                <input
                  id="taskTitle"
                  className="ws-input"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />

                <label className="ws-field-label" htmlFor="taskDescription">
                  Description
                </label>
                <textarea
                  id="taskDescription"
                  className="ws-input"
                  rows={4}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />

                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
                  <div>
                    <label className="ws-field-label" htmlFor="taskPriority">
                      Priority
                    </label>
                    <select
                      id="taskPriority"
                      className="ws-input"
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </div>
                  <div>
                    <label className="ws-field-label" htmlFor="taskDueDate">
                      Due Date
                    </label>
                    <input
                      id="taskDueDate"
                      type="date"
                      className="ws-input"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="ws-field-label" htmlFor="taskAssignedTo">
                    Assign To
                  </label>
                  <select
                    id="taskAssignedTo"
                    className="ws-input"
                    value={taskAssignedTo}
                    onChange={(e) => setTaskAssignedTo(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {members.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name || member.email || member._id}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button
                    className="ws-button"
                    onClick={selectedTask ? handleUpdateTask : handleCreateTask}
                    disabled={taskActionLoading}
                  >
                    {taskActionLoading ? "Saving…" : selectedTask ? "Save changes" : "Create task"}
                  </button>
                  {selectedTask && (
                    <button className="ws-button" onClick={handleReassignTask} disabled={taskActionLoading}>
                      {taskActionLoading ? "Reassigning…" : "Reassign task"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              {tasksLoading ? (
                <div className="spinner" />
              ) : tasks.length ? (
                <div className="ws-table">
                  <div className="ws-table-row ws-table-header">
                    <div>Title</div>
                    <div>Status</div>
                    <div>Priority</div>
                    <div>Assigned</div>
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
                      <div>{task.assignedTo?.name || task.assignedTo?.email || "Unassigned"}</div>
                      <div>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</div>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button className="ws-button" onClick={() => handleEditTask(task)}>
                          Edit
                        </button>
                        <button
                          className="ws-button ws-button--danger"
                          onClick={() => handleDeleteTask(task._id)}
                          disabled={taskActionLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-title">No tasks yet</div>
                  <p className="empty-state-desc">Create a task to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
