import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import { getMyProjects } from "../api/project";

export default function MemberProjects() {
  const { tenantId, workspace } = useWorkspace();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getMyProjects(tenantId);
        setProjects(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.msg || err.response?.data?.message || "Failed to load your projects.");
      } finally {
        setLoading(false);
      }
    };

    if (tenantId) {
      loadProjects();
    }
  }, [tenantId]);

  return (
    <div className="ws-page">
      <div className="ws-page-header">
        <div>
          <h1 className="ws-page-title">My Projects</h1>
          <p className="ws-page-subtitle">Projects you are assigned to in {workspace?.name || "this workspace"}.</p>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : error ? (
        <div className="alert-banner error">
          <span>{error}</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">No projects assigned</div>
          <p className="empty-state-desc">You don't have access to any projects in this workspace yet.</p>
        </div>
      ) : (
        <div className="ws-grid" style={{ display: "grid", gap: 18 }}>
          {projects.map((project) => (
            <button
              key={project._id}
              className="ws-card ws-card--interactive"
              onClick={() => navigate(`/tenant/${tenantId}/my-projects/${project._id}`)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <h2 className="ws-card-title" style={{ marginBottom: 8 }}>{project.name}</h2>
                  <p>{project.description || "No description provided."}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="ws-info-label">Members</div>
                  <div className="ws-info-value">{project.members?.length ?? 0}</div>
                </div>
              </div>
              <div className="ws-info-item" style={{ marginTop: 16 }}>
                <span className="ws-info-label">Due date</span>
                <div className="ws-info-value">{project.duedate ? new Date(project.duedate).toLocaleDateString() : "Not set"}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
