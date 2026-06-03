import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";

export default function WorkspaceHome() {
  const { workspace, isOwner, isAdmin, isMember, tenantId } = useWorkspace();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMember && tenantId) {
      navigate(`/tenant/${tenantId}/my-projects`);
    }
  }, [isMember, tenantId, navigate]);

  if (isMember) {
    return (
      <div className="ws-page">
        <div className="ws-page-header">
          <div>
            <h1 className="ws-page-title">My Projects</h1>
            <p className="ws-page-subtitle">Redirecting you to your assigned projects…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ws-page">
      <div className="ws-page-header">
        <div>
          <h1 className="ws-page-title">{workspace?.name || "Workspace"}</h1>
          <p className="ws-page-subtitle">Welcome to the workspace dashboard.</p>
        </div>
      </div>

      <div className="ws-card">
        <h2 className="ws-card-title">Quick Actions</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          {isOwner && <div className="quick-action">Workspace Settings</div>}
          {isOwner && <div className="quick-action">Team & Access</div>}
          {isAdmin && <div className="quick-action">Projects</div>}
          <div className="quick-action">Recent Activity</div>
        </div>
      </div>
    </div>
  );
}
