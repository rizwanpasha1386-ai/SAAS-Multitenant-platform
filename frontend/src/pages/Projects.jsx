import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import { getProjects, createProject, deleteProject } from "../api/project";

export default function Projects() {
  const { tenantId, workspace, isAdmin, isOwner } = useWorkspace();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duedate, setDuedate] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getProjects(tenantId);
      setProjects(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tenantId) return;
    loadProjects();
  }, [tenantId]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const res = await createProject(tenantId, {
        name,
        description,
        duedate,
      });

      if (res.data?.project) {
        setProjects((prev) => [res.data.project, ...prev]);
        setSuccess("Project created successfully.");
        setShowForm(false);
        setName("");
        setDescription("");
        setDuedate("");
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || "Unable to create project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(tenantId, projectId);
      setProjects((prev) => prev.filter((project) => project._id !== projectId));
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || "Unable to delete project.");
    }
  };

  return (
    <div className="ws-page">
      <div className="ws-page-header">
        <div>
          <h1 className="ws-page-title">Projects</h1>
          <p className="ws-page-subtitle">Manage tenant projects for {workspace?.name || tenantId}</p>
        </div>

        <button className="auth-btn" onClick={() => setShowForm(true)}>
          Create Project
        </button>
      </div>

      {error && (
        <div className="alert-banner error" style={{ marginBottom: 20 }}>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert-banner success" style={{ marginBottom: 20 }}>
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <div className="spinner" />
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">No projects found</div>
          <p className="empty-state-desc">Create your first project to start organizing work inside this tenant.</p>
        </div>
      ) : (
        <div className="workspace-grid">
          {projects.map((project) => (
            <div key={project._id} className="workspace-card">
              <div className="workspace-info">
                <div className="workspace-name">{project.name}</div>
                <div className="workspace-meta">{project.description || "No description"}</div>
                <div className="workspace-meta">Due: {project.duedate ? new Date(project.duedate).toLocaleDateString() : "No deadline"}</div>
                <div className="workspace-meta">Members: {project.members?.length ?? 0}</div>
              </div>

              <div className="workspace-actions" style={{ gap: 12, flexWrap: "wrap" }}>
                <button className="auth-btn" style={{ flex: 1 }} onClick={() => navigate(`/tenant/${tenantId}/projects/${project._id}`)}>
                  View Project
                </button>
                <button className="modal-btn-cancel" style={{ flex: 1 }} onClick={() => handleDeleteProject(project._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">Create New Project</div>
              <button className="modal-close-btn" onClick={() => setShowForm(false)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="input-label">Project Name</label>
                <div className="input-wrapper">
                  <input
                    className="auth-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter project name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Description</label>
                <div className="input-wrapper">
                  <textarea
                    className="auth-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the project"
                    rows={4}
                    style={{ resize: "vertical" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Due Date</label>
                <div className="input-wrapper">
                  <input
                    className="auth-input"
                    type="date"
                    value={duedate}
                    onChange={(e) => setDuedate(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={() => setShowForm(false)} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="auth-btn" style={{ flex: 1 }} disabled={saving}>
                  {saving ? <div className="spinner" /> : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
