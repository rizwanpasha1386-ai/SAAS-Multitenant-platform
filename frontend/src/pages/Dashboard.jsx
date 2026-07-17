import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔽 Fetch tenants
  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tenant`, {
        params: {
          search: search || undefined,
          role: role || undefined,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        setTenants(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load your workspaces. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔽 Create tenant
  const handleCreateTenant = async (e) => {
    e.preventDefault();

    if (!tenantName.trim() || !ownerName.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tenant`,
        {
          name: tenantName,
          ownerName: ownerName,
        },
        { withCredentials: true }
      );

      if (res.data.tenant) {
        setSuccess("Workspace created successfully!");

        // reset form inputs
        setTenantName("");
        setOwnerName("");

        // Close modal after a short delay
        setTimeout(() => {
          setShowForm(false);
          setSuccess("");
          fetchTenants(); // refresh lists
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Error creating workspace. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  // Triggers whenever search or role filters change
  useEffect(() => {
    fetchTenants();
  }, [search, role]);

  const navigate = useNavigate();

  // Render SVG icons inside role badges dynamically
  const renderRoleBadge = (userRole) => {
    const formattedRole = userRole || "member";

    if (formattedRole === "owner") {
      return (
        <span className="role-badge owner">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 100-2 1 1 0 000 2zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          Owner
        </span>
      );
    }

    if (formattedRole === "admin") {
      return (
        <span className="role-badge admin">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 11.37c-.129-.129-.166-.324-.094-.488l3-7A.5.5 0 015.5 3.5h5a.5.5 0 01.354.146l3 3a.5.5 0 010 .708l-9 9a.5.5 0 01-.354.146h-2a.5.5 0 01-.354-.146l-1-1z" clipRule="evenodd" />
          </svg>
          Admin
        </span>
      );
    }

    return (
      <span className="role-badge member">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        Member
      </span>
    );
  };

  return (
    <div className="dashboard-layout">
      {/* 🚀 NAVBAR / HEADER */}
      <div className="dashboard-header">
        <div className="dashboard-title-group">
          <h1 className="dashboard-title">Your Workspaces</h1>
          <p className="auth-subtitle">Manage your organizations, projects, and tenant groups</p>
        </div>

        <button className="auth-btn" style={{ width: "auto" }} onClick={() => setShowForm(true)}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Workspace
        </button>
      </div>

      {/* 🔍 SEARCH AND FILTERS */}
      <div className="dashboard-search-filters">
        <div className="dashboard-search-wrapper" style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search workspaces by name..."
            className="auth-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "44px" }}
          />
          <svg 
            width="18" 
            height="18" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24"
            style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="dashboard-select"
        >
          <option value="">All Roles</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
      </div>

      {/* ERROR BANNER */}
      {error && !showForm && (
        <div className="alert-banner error" style={{ maxWidth: "100%" }}>
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* 📋 WORKSPACE CARDS GRID */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="cards-grid">
          {tenants.map((t) => (
            <div key={t._id} className="workspace-card" onClick={() => navigate(`/tenant/${t._id}`)}>
              <div className="workspace-card-header">
                <div className="workspace-name">{t.name}</div>
                <div className="workspace-role">{renderRoleBadge(t.role)}</div>
              </div>
              <div className="workspace-meta">Created: {new Date(t.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE WORKSPACE MODAL */}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Create New Workspace</h3>
            <form onSubmit={handleCreateTenant} className="auth-form">
              <label>Workspace Name</label>
              <input className="auth-input" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
              <label>Owner Name</label>
              <input className="auth-input" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />

              {success && <div className="alert-banner success"><span>{success}</span></div>}
              {error && <div className="alert-banner error"><span>{error}</span></div>}

              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <button className="auth-btn" type="submit" disabled={creating}>{creating ? "Creating…" : "Create"}</button>
                <button className="auth-btn ghost" type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
