import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../../context/WorkspaceContext";
import { updateTenant, deleteTenant } from "../../api/tenant";

export default function WorkspaceSettings() {
  const { workspace, setWorkspace, tenantId } = useWorkspace();
  const navigate = useNavigate();

  // ── Edit form state ────────────────────────────────
  const [editName, setEditName]         = useState(workspace?.name || "");
  const [editOwnerName, setEditOwnerName] = useState(workspace?.ownerName || "");
  const [editLoading, setEditLoading]   = useState(false);
  const [editSuccess, setEditSuccess]   = useState("");
  const [editError, setEditError]       = useState("");

  // ── Delete confirmation state ──────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading]     = useState(false);
  const [deleteError, setDeleteError]         = useState("");

  // ── Handle Update ──────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim() && !editOwnerName.trim()) return;
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");
    try {
      const res = await updateTenant(tenantId, {
        name: editName,
        ownerName: editOwnerName,
      });
      // Sync the context state so the sidebar name updates instantly
      setWorkspace((prev) => ({
        ...prev,
        name: res.data.data?.name || editName,
        ownerName: res.data.data?.ownerName || editOwnerName,
      }));
      setEditSuccess("Workspace updated successfully!");
    } catch (err) {
      setEditError(
        err.response?.data?.message || err.response?.data?.msg || "Update failed."
      );
    } finally {
      setEditLoading(false);
    }
  };

  // ── Handle Delete ──────────────────────────────────
  const handleDelete = async () => {
    if (deleteConfirmText !== workspace?.name) {
      setDeleteError("Workspace name does not match. Please try again.");
      return;
    }
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await deleteTenant(tenantId);
      // Redirect back to the tenants list after deletion
      navigate("/tenants", { replace: true });
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || err.response?.data?.msg || "Delete failed."
      );
      setDeleteLoading(false);
    }
  };

  return (
    <div className="ws-page">
      {/* Page Header */}
      <div className="ws-page-header">
        <h1 className="ws-page-title">Workspace Settings</h1>
        <p className="ws-page-subtitle">
          Manage workspace identity and danger-zone operations
        </p>
      </div>

      {/* ── SECTION 1: Workspace Info ─────────────────── */}
      <div className="ws-card">
        <h2 className="ws-card-title">
          <InfoIcon /> Workspace Information
        </h2>

        {/* Read-only info strip */}
        <div className="ws-info-grid">
          <div className="ws-info-item">
            <span className="ws-info-label">Workspace ID</span>
            <code className="ws-info-value ws-mono">{workspace?._id}</code>
          </div>
          <div className="ws-info-item">
            <span className="ws-info-label">Created</span>
            <span className="ws-info-value">
              {workspace?.createdAt
                ? new Date(workspace.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric",
                  })
                : "—"}
            </span>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleUpdate} style={{ marginTop: 24 }}>
          {editSuccess && (
            <div className="alert-banner success" style={{ marginBottom: 20 }}>
              <CheckIcon /> <span>{editSuccess}</span>
            </div>
          )}
          {editError && (
            <div className="alert-banner error" style={{ marginBottom: 20 }}>
              <ErrIcon /> <span>{editError}</span>
            </div>
          )}

          <div className="ws-form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="input-label" htmlFor="ws-name">Workspace Name</label>
              <div className="input-wrapper">
                <input
                  id="ws-name"
                  type="text"
                  className="auth-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                />
              </div>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="input-label" htmlFor="ws-owner">Primary Representative</label>
              <div className="input-wrapper">
                <input
                  id="ws-owner"
                  type="text"
                  className="auth-input"
                  value={editOwnerName}
                  onChange={(e) => setEditOwnerName(e.target.value)}
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="auth-btn"
            style={{ width: "auto", marginTop: 8 }}
            disabled={editLoading}
          >
            {editLoading ? <div className="spinner" /> : "Save Changes"}
          </button>
        </form>
      </div>

      {/* ── SECTION 2: Danger Zone ─────────────────────── */}
      <div className="ws-card danger-zone">
        <h2 className="ws-card-title danger">
          <DangerIcon /> Danger Zone
        </h2>
        <p className="ws-page-subtitle" style={{ marginBottom: 20 }}>
          Deleting a workspace is permanent. All members, projects, and tasks
          will be erased. This action cannot be undone.
        </p>
        <button
          className="ws-danger-btn"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete This Workspace
        </button>
      </div>

      {/* ── DELETE CONFIRMATION MODAL ────────────────── */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title" style={{ color: "#ef4444" }}>
                Confirm Deletion
              </div>
              <button
                className="modal-close-btn"
                onClick={() => { setShowDeleteModal(false); setDeleteError(""); setDeleteConfirmText(""); }}
              >
                <CloseIcon />
              </button>
            </div>

            <p className="ws-page-subtitle" style={{ marginBottom: 20 }}>
              To confirm, type the workspace name{" "}
              <strong style={{ color: "#f3f4f6" }}>"{workspace?.name}"</strong>{" "}
              below:
            </p>

            {deleteError && (
              <div className="alert-banner error" style={{ marginBottom: 16 }}>
                <ErrIcon /> <span>{deleteError}</span>
              </div>
            )}

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  className="auth-input"
                  placeholder={workspace?.name}
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn-cancel"
                onClick={() => { setShowDeleteModal(false); setDeleteError(""); setDeleteConfirmText(""); }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="ws-danger-btn"
                onClick={handleDelete}
                disabled={deleteLoading || deleteConfirmText !== workspace?.name}
                style={{ flex: 1, padding: "14px" }}
              >
                {deleteLoading ? <div className="spinner" /> : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Mini inline icons ───────────────────────────────────────
function InfoIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function DangerIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}
function ErrIcon() {
  return (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
