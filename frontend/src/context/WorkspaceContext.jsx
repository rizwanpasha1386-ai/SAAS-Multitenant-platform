import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTenant } from "../api/tenant";
import axios from "axios";

// ─────────────────────────────────────
// 1. Create the Context object
// ─────────────────────────────────────
const WorkspaceContext = createContext(null);

// ─────────────────────────────────────
// 2. Provider Component — wraps all workspace pages
// ─────────────────────────────────────
export function WorkspaceProvider({ children }) {
  const { tenantId } = useParams(); // reads :tenantId from the URL

  const [workspace, setWorkspace] = useState(null);  // full tenant document
  const [userRole, setUserRole]   = useState(null);  // "owner" | "admin" | "member"
  const [currentUser, setCurrentUser] = useState(null); // logged-in user info
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  // ── Fetch workspace details + current user's role in one shot ──
  useEffect(() => {
    if (!tenantId) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        // a) Get workspace document from backend
        const wsRes = await getTenant(tenantId);
        setWorkspace(wsRes.data.data);

        // b) Get logged-in user info (already available via /api/auth/me)
        const meRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          withCredentials: true,
        });
        const me = meRes.data.user;
        setCurrentUser(me);

        // c) Determine the user's role in THIS tenant from the tenants list
        //    We use /api/tenant/ with no filters to get all memberships + roles
        const allRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/tenant`, {
          withCredentials: true,
        });
        const match = allRes.data.data.find(
          (t) => t._id === tenantId
        );
        setUserRole(match?.role || "member");
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.response?.data?.msg ||
          "Failed to load workspace."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tenantId]);

  // ── Expose everything child components might need ──
  const value = {
    tenantId,
    workspace,
    setWorkspace,   // allows Settings page to update it after a PATCH
    userRole,
    currentUser,
    loading,
    error,
    // Shorthand permission flags used throughout the app
    isOwner: userRole === "owner",
    isAdmin: userRole === "admin" || userRole === "owner",
    isMember: userRole === "member",
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// ─────────────────────────────────────
// 3. Custom hook — clean import for any child component
// ─────────────────────────────────────
export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return ctx;
}
