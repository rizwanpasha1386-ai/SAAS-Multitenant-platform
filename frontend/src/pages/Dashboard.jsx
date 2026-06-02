import { useEffect, useState } from "react";
<<<<<<< HEAD

import API from "../api/axios";

import TenantCard from "../components/TenantCard";
=======
import axios from "axios";
import { useNavigate } from "react-router-dom";
>>>>>>> 08e81da (feat(frontend): add tenant workspace routing, member project/task portals, and project/task API integration)

function Dashboard() {
  const [tenants, setTenants] = useState([]);

  const [search, setSearch] = useState("");

  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(false);

<<<<<<< HEAD
  // CREATE TENANT STATES
  const [showForm, setShowForm] = useState(false);

  const [tenantName, setTenantName] = useState("");

  const [ownerName, setOwnerName] = useState("");

  const [creating, setCreating] = useState(false);

  // FETCH TENANTS
=======
  const [showForm, setShowForm] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔽 Fetch tenants
>>>>>>> 08e81da (feat(frontend): add tenant workspace routing, member project/task portals, and project/task API integration)
  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/tenant", {
        params: {
          search: search || undefined,
          role: role || undefined,
        },
      });

<<<<<<< HEAD
      setTenants(res.data.data);

    } catch (err) {
      console.error(err);
=======
      if (res.data.success) {
        setTenants(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load your workspaces. Please try again.");
>>>>>>> 08e81da (feat(frontend): add tenant workspace routing, member project/task portals, and project/task API integration)
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // CREATE TENANT
  const createTenant = async () => {
    if (!tenantName || !ownerName) {
      return alert("All fields required");
=======
  // 🔽 Create tenant
  const handleCreateTenant = async (e) => {
    e.preventDefault();

    if (!tenantName.trim() || !ownerName.trim()) {
      setError("Please fill out all fields.");
      return;
>>>>>>> 08e81da (feat(frontend): add tenant workspace routing, member project/task portals, and project/task API integration)
    }

    try {
      setCreating(true);
<<<<<<< HEAD

      await API.post("/tenant", {
        name: tenantName,
        ownerName,
      });

      alert("Tenant created");

      setTenantName("");

      setOwnerName("");

      setShowForm(false);

      fetchTenants();

    } catch (err) {
      console.error(err);
      alert("Error creating tenant");
=======
      setError("");
      setSuccess("");

      const res = await axios.post(
        "http://localhost:8000/api/tenant",
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
>>>>>>> 08e81da (feat(frontend): add tenant workspace routing, member project/task portals, and project/task API integration)
    } finally {
      setCreating(false);
    }
  };

<<<<<<< HEAD
=======
  // Triggers whenever search or role filters change
>>>>>>> 08e81da (feat(frontend): add tenant workspace routing, member project/task portals, and project/task API integration)
  useEffect(() => {
    fetchTenants();
  }, [search, role]);

<<<<<<< HEAD
  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h1>Tenants Dashboard</h1>

      {/* SEARCH + FILTER */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search tenants..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          style={{ marginLeft: "10px" }}
=======
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
>>>>>>> 08e81da (feat(frontend): add tenant workspace routing, member project/task portals, and project/task API integration)
        >
          <option value="">All Roles</option>

          <option value="owner">
            Owner
          </option>

          <option value="admin">
            Admin
          </option>

          <option value="member">
            Member
          </option>
        </select>
      </div>

<<<<<<< HEAD
      {/* CREATE TENANT BUTTON */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          {showForm
            ? "Cancel"
            : "Create Tenant"}
        </button>
      </div>

      {/* CREATE TENANT FORM */}
      {showForm && (
        <div
          style={{
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3>Create Tenant</h3>

          <input
            type="text"
            placeholder="Tenant Name"
            value={tenantName}
            onChange={(e) =>
              setTenantName(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) =>
              setOwnerName(e.target.value)
            }
            style={{ marginLeft: "10px" }}
          />

          <button
            onClick={createTenant}
            disabled={creating}
            style={{ marginLeft: "10px" }}
          >
            {creating
              ? "Creating..."
              : "Submit"}
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* EMPTY */}
      {!loading &&
        tenants.length === 0 && (
          <p>No tenants found</p>
        )}

      {/* TENANTS */}
      <div>
        {tenants.map((tenant) => (
          <TenantCard
            key={tenant._id}
            tenant={tenant}
          />
        ))}
      </div>
=======
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
      ) : tenants.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">No Workspaces Found</div>
          <p className="empty-state-desc">
            {search || role 
              ? "No workspaces match your search filters. Try adjusting them!"
              : "You aren't associated with any workspaces yet. Create one to get started!"}
          </p>
          {!search && !role && (
            <button className="auth-btn" style={{ width: "auto", margin: "0 auto" }} onClick={() => setShowForm(true)}>
              Create Your First Workspace
            </button>
          )}
        </div>
      ) : (
        <ul className="workspace-grid">
          {tenants.map((tenant) => (
            <li
              key={tenant._id}
              className="workspace-card"
              onClick={() => {
                if (tenant.role === "member") {
                  navigate(`/tenant/${tenant._id}/my-projects`);
                } else {
                  navigate(`/tenant/${tenant._id}/projects`);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="workspace-info">
                <div className="workspace-name">{tenant.name}</div>
                <div className="workspace-meta">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>Owner: <strong>{tenant.ownerName}</strong></span>
                </div>
              </div>

              <div className="workspace-actions">
                <span className="workspace-meta" style={{ fontSize: "12px" }}>
                  ID: {tenant._id.slice(-6).toUpperCase()}
                </span>
                
                {/* 🎨 GLOWING ROLE BADGE */}
                {renderRoleBadge(tenant.role)}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 🧾 ELEGANT GLASS CREATE WORKSPACE MODAL */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">New Workspace</div>
              <button className="modal-close-btn" onClick={() => { setShowForm(false); setError(""); setSuccess(""); }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {error && (
              <div className="alert-banner error">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert-banner success">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleCreateTenant}>
              <div className="form-group">
                <label className="input-label" htmlFor="tenantName">Workspace Name</label>
                <div className="input-wrapper">
                  <input
                    id="tenantName"
                    type="text"
                    placeholder="e.g. Acme Corp"
                    className="auth-input"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-label" htmlFor="ownerName">Primary Representative</label>
                <div className="input-wrapper">
                  <input
                    id="ownerName"
                    type="text"
                    placeholder="e.g. John Doe"
                    className="auth-input"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="modal-btn-cancel" 
                  onClick={() => { setShowForm(false); setError(""); setSuccess(""); }}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="auth-btn" 
                  style={{ flex: 1 }}
                  disabled={creating || !tenantName.trim() || !ownerName.trim()}
                >
                  {creating ? <div className="spinner"></div> : "Create Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
>>>>>>> 08e81da (feat(frontend): add tenant workspace routing, member project/task portals, and project/task API integration)
    </div>
  );
}

export default Dashboard;