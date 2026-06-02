import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { WorkspaceProvider, useWorkspace } from "../context/WorkspaceContext";

// ─────────────────────────────────────────────────────────────
// Inner layout — consumes the context that the Provider wraps
// ─────────────────────────────────────────────────────────────
function LayoutInner() {
  const { workspace, userRole, currentUser, loading, error, isOwner, isAdmin, isMember, tenantId } =
    useWorkspace();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="ws-loading">
        <div className="spinner" />
        <p>Loading workspace…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ws-loading">
        <div className="alert-banner error" style={{ maxWidth: 400 }}>
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Build sidebar nav items based on role (use absolute paths to avoid relative appending)
  const navItems = [];

  if (isOwner) {
    navItems.push(
      { to: `/tenant/${tenantId}/settings`, label: "Workspace Settings", icon: SettingsIcon },
      { to: `/tenant/${tenantId}/members`,  label: "Team & Access",       icon: TeamIcon }
    );
  }

  if (isAdmin) {
    navItems.push(
      { to: `/tenant/${tenantId}/projects`, label: "Projects",            icon: ProjectsIcon }
    );
  }

  if (isMember) {
    navItems.push(
      { to: `/tenant/${tenantId}/my-projects`, label: "My Projects", icon: ProjectsIcon }
    );
  }

  const roleBadgeClass =
    userRole === "owner" ? "owner" : userRole === "admin" ? "admin" : "member";

  return (
    <div className="ws-shell">
      {/* ── LEFT SIDEBAR ── */}
      <aside className="ws-sidebar">
        {/* Back to tenants */}
        <button className="ws-back-btn" onClick={() => navigate("/tenants")}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All Workspaces
        </button>

        {/* Workspace identity */}
        <div className="ws-identity">
          <div className="ws-avatar">
            {workspace?.name?.[0]?.toUpperCase() || "W"}
          </div>
          <div>
            <div className="ws-identity-name">{workspace?.name}</div>
            <span className={`role-badge ${roleBadgeClass}`} style={{ marginTop: 4 }}>
              {userRole}
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="ws-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `ws-nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info at the bottom */}
        <div className="ws-sidebar-footer">
          <div className="ws-user-pill">
            <div className="ws-user-avatar">
              {currentUser?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="ws-user-info">
              <div className="ws-user-name">{currentUser?.name}</div>
              <div className="ws-user-email">{currentUser?.email}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT (dynamic per route) ── */}
      <main className="ws-main">
        <Outlet />
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Outer exported component — wraps everything in the Provider
// ─────────────────────────────────────────────────────────────
export default function WorkspaceLayout() {
  return (
    <WorkspaceProvider>
      <LayoutInner />
    </WorkspaceProvider>
  );
}

// ── Inline SVG Icon components ──────────────────────────────
function SettingsIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
