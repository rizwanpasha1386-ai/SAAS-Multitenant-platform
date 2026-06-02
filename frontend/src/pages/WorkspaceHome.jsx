import { useWorkspace } from "../context/WorkspaceContext";

export default function WorkspaceHome() {
  const { workspace, isOwner, isAdmin } = useWorkspace();

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
