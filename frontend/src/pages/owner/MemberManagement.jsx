import { useState, useEffect, useCallback } from "react";
import { useWorkspace } from "../../context/WorkspaceContext";
import {
  getMembers,
  addMembers,
  deleteMember,
  updateMemberRole,
  createAdmin,
} from "../../api/tenant";

export default function MemberManagement() {
  const { tenantId } = useWorkspace();

  // ── Members list state ─────────────────────────────
  const [members, setMembers]       = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError]   = useState("");
  const [search, setSearch]         = useState("");
  const [filterRole, setFilterRole] = useState("");

  // ── Add Member modal state ─────────────────────────
  const [showAddModal, setShowAddModal]     = useState(false);
  const [addUserIds, setAddUserIds]         = useState("");   // comma-separated userIds
  const [addLoading, setAddLoading]         = useState(false);
  const [addError, setAddError]             = useState("");
  const [addSuccess, setAddSuccess]         = useState("");

  // ── Create Admin modal state ───────────────────────
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail]         = useState("");
  const [adminLoading, setAdminLoading]     = useState(false);
  const [adminError, setAdminError]         = useState("");
  const [adminSuccess, setAdminSuccess]     = useState("");

  // ── Inline role-update state ───────────────────────
  const [roleUpdateLoading, setRoleUpdateLoading] = useState(null); // memberId
  const [roleUpdateError, setRoleUpdateError]     = useState("");

  // ── Delete state ───────────────────────────────────
  const [deleteLoading, setDeleteLoading] = useState(null); // memberId
  const [deleteError, setDeleteError]     = useState("");

  // ── Fetch members ──────────────────────────────────
  const fetchMembers = useCallback(async () => {
    setLoadingList(true);
    setListError("");
    try {
      const params = {};
      if (search) params.search = search;
      if (filterRole) params.role = filterRole;
      const res = await getMembers(tenantId, params);
      setMembers(res.data.data || []);
    } catch (err) {
      // 404 just means no members found — treat as empty
      if (err.response?.status === 404) {
        setMembers([]);
      } else {
        setListError(err.response?.data?.message || "Failed to load members.");
      }
    } finally {
      setLoadingList(false);
    }
  }, [tenantId, search, filterRole]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  // ── Add Members ────────────────────────────────────
  const handleAddMembers = async (e) => {
    e.preventDefault();
    const emails = addUserIds.split(",").map((s) => s.trim()).filter(Boolean);
    if (!emails.length) { setAddError("Enter at least one User ID."); return; }
    setAddLoading(true); setAddError(""); setAddSuccess("");
    try {
      await addMembers(tenantId, emails);
      setAddSuccess("Members added successfully!");
      setAddUserIds("");
      fetchMembers();
      setTimeout(() => { setShowAddModal(false); setAddSuccess(""); }, 1200);
    } catch (err) {
      setAddError(err.response?.data?.msg || "Failed to add members.");
    } finally { setAddLoading(false); }
  };

  // ── Create Admin ───────────────────────────────────
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!adminEmail.trim()) { setAdminError("Email is required."); return; }
    setAdminLoading(true); setAdminError(""); setAdminSuccess("");
    try {
      await createAdmin(tenantId, adminEmail);
      setAdminSuccess("Admin created successfully!");
      setAdminEmail("");
      fetchMembers();
      setTimeout(() => { setShowAdminModal(false); setAdminSuccess(""); }, 1200);
    } catch (err) {
      setAdminError(err.response?.data?.msg || "Failed to create admin.");
    } finally { setAdminLoading(false); }
  };

  // ── Update Role ────────────────────────────────────
  const handleRoleChange = async (memberId, newRole) => {
    setRoleUpdateLoading(memberId);
    setRoleUpdateError("");
    try {
      await updateMemberRole(tenantId, memberId, newRole);
      setMembers((prev) =>
        prev.map((m) => (m.user?._id === memberId ? { ...m, role: newRole } : m))
      );
    } catch (err) {
      setRoleUpdateError(err.response?.data?.message || "Role update failed.");
    } finally { setRoleUpdateLoading(null); }
  };

  // ── Delete Member ──────────────────────────────────
  const handleDelete = async (memberId) => {
    setDeleteLoading(memberId); setDeleteError("");
    try {
      await deleteMember(tenantId, memberId);
      setMembers((prev) => prev.filter((m) => m.user?._id !== memberId));
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Could not remove member.");
    } finally { setDeleteLoading(null); }
  };

  return (
    <div className="ws-page">
      {/* Page Header */}
      <div className="ws-page-header">
        <div>
          <h1 className="ws-page-title">Team & Access Control</h1>
          <p className="ws-page-subtitle">
            Manage members, roles, and workspace access
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="ws-outline-btn"
            onClick={() => { setShowAdminModal(true); setAdminError(""); setAdminSuccess(""); }}
          >
            <ShieldIcon /> Promote to Admin
          </button>
          <button
            className="auth-btn"
            style={{ width: "auto" }}
            onClick={() => { setShowAddModal(true); setAddError(""); setAddSuccess(""); }}
          >
            <PlusIcon /> Add Members
          </button>
        </div>
      </div>

      {/* ── FILTERS ───────────────────────────────────── */}
      <div className="dashboard-search-filters">
        <div className="dashboard-search-wrapper" style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search by name or email…"
            className="auth-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 44 }}
          />
          <SearchIcon style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        </div>
        <select
          className="dashboard-select"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
      </div>

      {/* Inline errors */}
      {(roleUpdateError || deleteError || listError) && (
        <div className="alert-banner error" style={{ maxWidth: "100%", marginBottom: 20 }}>
          <ErrIcon /> <span>{roleUpdateError || deleteError || listError}</span>
        </div>
      )}

      {/* ── MEMBERS TABLE ─────────────────────────────── */}
      <div className="ws-card" style={{ padding: 0, overflow: "hidden" }}>
        {loadingList ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <div className="spinner" />
          </div>
        ) : members.length === 0 ? (
          <div className="empty-state" style={{ border: "none" }}>
            <div className="empty-state-title">No members found</div>
            <p className="empty-state-desc">
              {search || filterRole
                ? "Try changing your filters."
                : "Add members to this workspace using the button above."}
            </p>
          </div>
        ) : (
          <table className="ws-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const user = m.user;
                const isUpdating = roleUpdateLoading === user?._id;
                const isDeleting = deleteLoading === user?._id;

                return (
                  <tr key={m._id}>
                    {/* Avatar + Name */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="ws-table-avatar">
                          {user?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span className="ws-table-name">{user?.name || "Unknown"}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="ws-table-email">{user?.email || "—"}</td>

                    {/* Role selector */}
                    <td>
                      {m.role === "owner" ? (
                        <span className="role-badge owner">Owner</span>
                      ) : (
                        <select
                          className="ws-role-select"
                          value={m.role}
                          disabled={isUpdating}
                          onChange={(e) => handleRoleChange(user?._id, e.target.value)}
                        >
                          <option value="admin">Admin</option>
                          <option value="member">Member</option>
                        </select>
                      )}
                    </td>

                    {/* Delete button */}
                    <td style={{ textAlign: "right" }}>
                      {m.role !== "owner" && (
                        <button
                          className="ws-icon-danger-btn"
                          disabled={isDeleting}
                          onClick={() => handleDelete(user?._id)}
                          title="Remove member"
                        >
                          {isDeleting ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <TrashIcon />}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── ADD MEMBERS MODAL ─────────────────────────── */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">Add Members</div>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}><CloseIcon /></button>
            </div>
            <p className="ws-page-subtitle" style={{ marginBottom: 20 }}>
              Enter one or more User IDs separated by commas.
            </p>
            {addError   && <div className="alert-banner error" style={{ marginBottom: 16 }}><ErrIcon /><span>{addError}</span></div>}
            {addSuccess && <div className="alert-banner success" style={{ marginBottom: 16 }}><CheckIcon /><span>{addSuccess}</span></div>}
            <form onSubmit={handleAddMembers}>
              <div className="form-group">
                <label className="input-label" htmlFor="add-ids">User IDs</label>
                <div className="input-wrapper">
                  <input
                    id="add-ids"
                    type="text"
                    className="auth-input"
                    placeholder="64abc..., 64def..., ..."
                    value={addUserIds}
                    onChange={(e) => setAddUserIds(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="auth-btn" style={{ flex: 1 }} disabled={addLoading}>
                  {addLoading ? <div className="spinner" /> : "Add Members"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PROMOTE TO ADMIN MODAL ────────────────────── */}
      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">Promote to Admin</div>
              <button className="modal-close-btn" onClick={() => setShowAdminModal(false)}><CloseIcon /></button>
            </div>
            <p className="ws-page-subtitle" style={{ marginBottom: 20 }}>
              Enter the email of an existing user. They will be added as an Admin directly.
            </p>
            {adminError   && <div className="alert-banner error" style={{ marginBottom: 16 }}><ErrIcon /><span>{adminError}</span></div>}
            {adminSuccess && <div className="alert-banner success" style={{ marginBottom: 16 }}><CheckIcon /><span>{adminSuccess}</span></div>}
            <form onSubmit={handleCreateAdmin}>
              <div className="form-group">
                <label className="input-label" htmlFor="admin-email">User Email</label>
                <div className="input-wrapper">
                  <input
                    id="admin-email"
                    type="email"
                    className="auth-input"
                    placeholder="admin@example.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={() => setShowAdminModal(false)}>Cancel</button>
                <button type="submit" className="auth-btn" style={{ flex: 1 }} disabled={adminLoading}>
                  {adminLoading ? <div className="spinner" /> : "Promote to Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Inline icons ──────────────────────────────────────────────
function PlusIcon()   { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function ShieldIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function TrashIcon()  { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>; }
function SearchIcon({ style }) { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={style}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function ErrIcon()   { return <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>; }
function CheckIcon()  { return <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>; }
function CloseIcon()  { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
